#!/usr/bin/env python3
"""
Book Preprocessor - Convert PDF to Markdown + Images

Uses PyMuPDF4LLM with optimal settings for finance/trading books.

Usage:
    python scripts/book_preprocess.py book.pdf
    python scripts/book_preprocess.py book-folder/
    python scripts/book_preprocess.py book.pdf --output data/books/
    python scripts/book_preprocess.py book.pdf --dpi 300 --ocr
    python scripts/book_preprocess.py book.pdf --use-toc-headers
    python scripts/book_preprocess.py book.pdf --pages 1-50,75-100

Requirements:
    pip install pymupdf4llm
"""

import argparse
import json
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

try:
    import pymupdf.layout  # Must be before pymupdf4llm - enables ML layout analysis + smart OCR
    import pymupdf4llm
    import pymupdf
except ImportError:
    print("ERROR: pymupdf4llm not installed")
    print("Run: pip install pymupdf4llm")
    sys.exit(1)


def classify_page_content(page, table_strategy="lines_strict"):
    """Classify what content a PDF page contains.

    Uses PyMuPDF APIs to detect text, images, vector graphics, and tables.

    Returns:
        dict with detection results and overall content_type classification.
    """
    # Text
    text = page.get_text()
    text_length = len(text.strip())
    has_text = text_length > 50  # More than just page numbers/headers

    # Raster images (photos, charts saved as images)
    images = page.get_images()
    image_count = len(images)
    has_images = image_count > 0

    # Vector graphics (lines, curves, shapes = diagrams, flowcharts)
    drawings = page.get_drawings()
    drawing_count = len(drawings)
    # Filter noise: simple borders/lines produce <10 drawing objects,
    # real diagrams/charts typically have 20+ objects
    has_drawings = drawing_count > 15

    # Tables
    try:
        tables = page.find_tables(strategy=table_strategy)
        table_count = len(tables.tables) if tables else 0
    except Exception:
        table_count = 0
    has_tables = table_count > 0

    # Classify overall content type
    has_visual = has_images or has_drawings
    if not has_text and not has_visual:
        content_type = "empty"
    elif has_text and not has_visual and not has_tables:
        content_type = "text"
    elif not has_text and has_visual:
        content_type = "visual"
    else:
        content_type = "mixed"

    return {
        "has_text": has_text,
        "has_images": has_images,
        "has_drawings": has_drawings,
        "has_tables": has_tables,
        "text_length": text_length,
        "image_count": image_count,
        "drawing_count": drawing_count,
        "table_count": table_count,
        "content_type": content_type,
    }


def classify_document_pages(pdf_file, pages=None, table_strategy="lines_strict"):
    """Classify all pages in a PDF document.

    Args:
        pdf_file: Path to PDF
        pages: List of 0-indexed page numbers (None = all)
        table_strategy: Table detection strategy

    Returns:
        dict mapping 0-indexed page number to classification
    """
    doc = pymupdf.open(str(pdf_file))
    pages_to_check = pages if pages else range(len(doc))
    classifications = {}

    for page_num in pages_to_check:
        if page_num >= len(doc):
            continue
        classifications[page_num] = classify_page_content(
            doc[page_num], table_strategy
        )

    doc.close()
    return classifications


def parse_args():
    parser = argparse.ArgumentParser(
        description="Convert PDF books to Markdown + extracted images",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s book.pdf                          # Basic conversion
  %(prog)s book.pdf --use-toc-headers        # Use TOC for headers (recommended)
  %(prog)s book.pdf --dpi 300                # High-res images for charts
  %(prog)s book.pdf --ocr                    # OCR for scanned PDFs
  %(prog)s book.pdf --pages 1-50             # First 50 pages only
  %(prog)s book-folder/                      # Multiple PDFs in folder
  %(prog)s book.pdf --embed-images           # Base64 images (single file)
        """
    )

    # Required
    parser.add_argument(
        "input_path",
        help="PDF file or folder containing multiple PDFs"
    )

    # Output options
    parser.add_argument(
        "--output", "-o",
        default=None,
        help="Output directory (default: data/books/)"
    )
    parser.add_argument(
        "--page-chunks",
        action="store_true",
        help="Also save individual page files"
    )

    # Image options
    parser.add_argument(
        "--dpi",
        type=int,
        default=150,
        help="Image resolution (default: 150, use 300 for charts)"
    )
    parser.add_argument(
        "--image-format",
        choices=["png", "jpg", "jpeg"],
        default="png",
        help="Image format (default: png)"
    )
    parser.add_argument(
        "--skip-images",
        action="store_true",
        help="Don't extract images at all"
    )
    parser.add_argument(
        "--embed-images",
        action="store_true",
        help="Embed images as base64 in markdown (no separate files)"
    )
    parser.add_argument(
        "--image-size-limit",
        type=float,
        default=0.05,
        help="Min image size as %% of page (default: 0.05 = 5%%, filters icons)"
    )

    # Text/structure options
    parser.add_argument(
        "--use-toc-headers",
        action="store_true",
        help="Use document TOC for header detection (recommended for books)"
    )
    parser.add_argument(
        "--use-font-headers",
        action="store_true",
        help="Use font size analysis for header detection"
    )
    parser.add_argument(
        "--no-headers",
        action="store_true",
        help="Exclude page headers from output"
    )
    parser.add_argument(
        "--no-footers",
        action="store_true",
        help="Exclude page footers from output"
    )
    parser.add_argument(
        "--force-text",
        action="store_true",
        default=True,
        help="Extract text over images (default: True)"
    )
    parser.add_argument(
        "--no-force-text",
        action="store_true",
        help="Don't extract text over images"
    )
    parser.add_argument(
        "--ignore-code",
        action="store_true",
        help="Disable code block detection"
    )

    # Table options
    parser.add_argument(
        "--table-strategy",
        default="lines_strict",
        choices=["lines_strict", "lines", "text", "explicit"],
        help="Table detection method (default: lines_strict)"
    )

    # OCR options
    parser.add_argument(
        "--ocr",
        action="store_true",
        help="Enable OCR for scanned PDFs (requires tesseract)"
    )
    parser.add_argument(
        "--ocr-language",
        default="eng",
        help="OCR language code (default: eng)"
    )
    parser.add_argument(
        "--ocr-dpi",
        type=int,
        default=400,
        help="OCR image resolution (default: 400, higher than display dpi)"
    )

    # Page selection
    parser.add_argument(
        "--pages",
        default=None,
        help="Page range, e.g., '1-50' or '1,5,10-20' (1-indexed, human-friendly)"
    )

    # Page-as-image mode (for AI vision reading)
    parser.add_argument(
        "--pages-as-images",
        action="store_true",
        help="Render each page as an image (for AI vision reading)"
    )
    parser.add_argument(
        "--pages-as-images-only",
        action="store_true",
        help="ONLY render pages as images (skip text extraction)"
    )
    parser.add_argument(
        "--page-image-format",
        choices=["png", "jpg", "jpeg"],
        default="png",
        help="Format for page images (default: png)"
    )
    parser.add_argument(
        "--page-image-dpi",
        type=int,
        default=150,
        help="DPI for page images (default: 150, use 200-300 for formulas)"
    )

    return parser.parse_args()


def parse_page_range(page_str: str, total_pages: int) -> list:
    """Parse page range string to list of 0-indexed page numbers.

    Input is 1-indexed (human-friendly), output is 0-indexed (API-friendly).

    Examples:
        "1-10" -> [0,1,2,3,4,5,6,7,8,9]
        "1,5,10" -> [0,4,9]
        "1-5,10-15" -> [0,1,2,3,4,9,10,11,12,13,14]
    """
    if not page_str:
        return None

    pages = []
    for part in page_str.strip().split(","):
        part = part.strip()
        if "-" in part:
            start, end = part.split("-", 1)
            start = max(1, int(start.strip())) - 1  # Convert to 0-indexed, min 0
            end = min(int(end.strip()), total_pages)  # Cap at total pages
            pages.extend(range(start, end))
        else:
            page_num = int(part.strip()) - 1  # Convert to 0-indexed
            if 0 <= page_num < total_pages:
                pages.append(page_num)

    return sorted(set(pages)) if pages else None


def get_pdf_files(input_path: Path) -> tuple[list[Path], str]:
    """Get list of PDF files and book name from input path."""
    if input_path.is_file():
        if input_path.suffix.lower() != ".pdf":
            print(f"ERROR: Not a PDF file: {input_path}")
            sys.exit(1)
        return [input_path], input_path.stem

    elif input_path.is_dir():
        pdf_files = sorted(input_path.glob("*.pdf"))
        if not pdf_files:
            print(f"ERROR: No PDF files found in: {input_path}")
            sys.exit(1)
        return pdf_files, input_path.name

    else:
        print(f"ERROR: Path not found: {input_path}")
        sys.exit(1)


def get_total_pages(pdf_file: Path) -> int:
    """Get total page count from PDF without full processing."""
    doc = pymupdf.open(str(pdf_file))
    count = len(doc)
    doc.close()
    return count


def render_pages_as_images(
    pdf_file: Path,
    output_dir: Path,
    dpi: int = 150,
    image_format: str = "png",
    pages: list = None,
    global_page_offset: int = 0,
) -> int:
    """Render PDF pages as images (for AI vision reading).

    Args:
        pdf_file: Path to PDF
        output_dir: Directory for page images
        dpi: Resolution (150 for reading, 200-300 for formulas)
        image_format: png or jpg
        pages: List of 0-indexed page numbers (None = all)
        global_page_offset: Offset for page numbering (multi-PDF support)

    Returns:
        Number of pages rendered
    """
    doc = pymupdf.open(str(pdf_file))
    output_dir.mkdir(parents=True, exist_ok=True)

    pages_to_render = pages if pages else range(len(doc))
    rendered = 0

    for page_num in pages_to_render:
        if page_num >= len(doc):
            continue

        page = doc[page_num]
        pix = page.get_pixmap(dpi=dpi)

        global_num = global_page_offset + rendered + 1
        filename = f"page_{global_num:04d}.{image_format}"
        filepath = output_dir / filename

        pix.save(str(filepath))
        rendered += 1

    doc.close()
    return rendered


def get_header_info(pdf_file: Path, use_toc: bool = False, use_font: bool = False):
    """Get header detection object if requested.

    Args:
        pdf_file: Path to PDF
        use_toc: Use TocHeaders (faster, uses document TOC)
        use_font: Use IdentifyHeaders (scans font sizes)

    Returns:
        Header info object or None
    """
    if not use_toc and not use_font:
        return None

    doc = pymupdf.open(str(pdf_file))

    if use_toc:
        # TocHeaders: Uses document's Table of Contents
        # Faster and more accurate for well-structured books
        toc = doc.get_toc()
        if not toc:
            print(f"    Warning: No TOC found, falling back to font-based headers")
            hdr_info = pymupdf4llm.IdentifyHeaders(doc)
        else:
            hdr_info = pymupdf4llm.TocHeaders(doc)
            print(f"    Using TOC headers ({len(toc)} entries)")
    else:
        # IdentifyHeaders: Scans font sizes across document
        # Better for documents without TOC
        hdr_info = pymupdf4llm.IdentifyHeaders(doc)
        print(f"    Using font-based headers")

    doc.close()
    return hdr_info


def preprocess_book(
    pdf_files: list[Path],
    book_name: str,
    output_dir: Path,
    dpi: int = 150,
    image_format: str = "png",
    skip_images: bool = False,
    embed_images: bool = False,
    image_size_limit: float = 0.05,
    use_toc_headers: bool = False,
    use_font_headers: bool = False,
    include_headers: bool = True,
    include_footers: bool = True,
    force_text: bool = True,
    ignore_code: bool = False,
    table_strategy: str = "lines_strict",
    use_ocr: bool = False,
    ocr_language: str = "eng",
    ocr_dpi: int = 400,
    page_range_str: str = None,
    save_page_chunks: bool = False,
    pages_as_images: bool = False,
    pages_as_images_only: bool = False,
    page_image_format: str = "png",
    page_image_dpi: int = 150,
) -> dict:
    """Convert PDF(s) to markdown with images extracted.

    Uses optimal PyMuPDF4LLM settings based on official documentation.
    """

    # Create output structure
    output_path = output_dir / book_name
    markdown_dir = output_path / "markdown"
    images_dir = output_path / "images"
    page_images_dir = output_path / "page_images"

    # Create directories based on mode
    if not pages_as_images_only:
        markdown_dir.mkdir(parents=True, exist_ok=True)
        if not skip_images and not embed_images:
            images_dir.mkdir(exist_ok=True)
    else:
        output_path.mkdir(parents=True, exist_ok=True)

    if pages_as_images or pages_as_images_only:
        page_images_dir.mkdir(parents=True, exist_ok=True)

    all_markdown = []
    page_mapping = []
    page_classifications = {}  # global_page_num -> classification
    global_page = 0
    total_images = 0

    print(f"\n{'='*60}")
    print(f"BOOK PREPROCESSOR (PyMuPDF4LLM)")
    print(f"{'='*60}")
    print(f"Book: {book_name}")
    print(f"PDFs: {len(pdf_files)}")
    print(f"Output: {output_path}")
    print(f"Settings:")
    print(f"  - DPI: {dpi}")
    print(f"  - Table strategy: {table_strategy}")
    print(f"  - Image size limit: {image_size_limit*100:.0f}% of page")
    if use_toc_headers:
        print(f"  - Headers: TOC-based (recommended)")
    elif use_font_headers:
        print(f"  - Headers: Font-size based")
    if use_ocr:
        print(f"  - OCR: enabled ({ocr_language}, {ocr_dpi} dpi)")
    if page_range_str:
        print(f"  - Pages: {page_range_str}")
    if pages_as_images or pages_as_images_only:
        print(f"  - Page images: {page_image_dpi} dpi, {page_image_format}")
    if pages_as_images_only:
        print(f"  - Mode: IMAGES ONLY (no text extraction)")
    print(f"{'='*60}\n")

    for pdf_idx, pdf_file in enumerate(pdf_files):
        print(f"[{pdf_idx + 1}/{len(pdf_files)}] Processing: {pdf_file.name}")

        try:
            # Get total pages for this PDF
            total_pdf_pages = get_total_pages(pdf_file)
            print(f"    Total pages in PDF: {total_pdf_pages}")

            # Parse page range for this specific PDF
            pages = parse_page_range(page_range_str, total_pdf_pages)
            if pages:
                print(f"    Processing pages: {len(pages)} of {total_pdf_pages}")

            pdf_start = global_page + 1
            pdf_pages = 0

            # Classify page content (detect images, drawings, tables)
            print(f"    Classifying page content...")
            pdf_classifications = classify_document_pages(
                pdf_file, pages, table_strategy
            )
            pages_with_images = sum(
                1 for c in pdf_classifications.values() if c["has_images"]
            )
            pages_with_drawings = sum(
                1 for c in pdf_classifications.values() if c["has_drawings"]
            )
            pages_with_tables = sum(
                1 for c in pdf_classifications.values() if c["has_tables"]
            )
            pages_visual_only = sum(
                1 for c in pdf_classifications.values()
                if c["content_type"] == "visual"
            )
            pages_empty = sum(
                1 for c in pdf_classifications.values()
                if c["content_type"] == "empty"
            )
            print(
                f"    Content: {pages_with_images} pages with images, "
                f"{pages_with_drawings} with drawings, "
                f"{pages_with_tables} with tables, "
                f"{pages_visual_only} visual-only, "
                f"{pages_empty} empty"
            )

            # Auto-render visual-only pages as full-page images
            # Only for books with a FEW visual-only pages (covers, charts).
            # If majority is visual-only → scanned PDF → skip, suggest --ocr.
            total_classified = len(pdf_classifications)
            visual_only_pages = [
                pg_num for pg_num, c in pdf_classifications.items()
                if c["content_type"] == "visual"
            ]
            is_scanned_pdf = pages_visual_only > total_classified * 0.5
            if is_scanned_pdf and not pages_as_images and not pages_as_images_only and not use_ocr:
                print(f"    ⚠ {pages_visual_only}/{total_classified} pages are visual-only — scanned PDF detected")
                print(f"    Auto-enabling --pages-as-images for AI vision processing")
                pages_as_images = True
                pages_as_images_only = True
                page_images_dir.mkdir(parents=True, exist_ok=True)

            if visual_only_pages and not pages_as_images_only:
                if is_scanned_pdf:
                    pass  # Scanned but --ocr or --pages-as-images provided, proceed
                else:
                    images_dir.mkdir(parents=True, exist_ok=True)
                    print(f"    Extracting {len(visual_only_pages)} visual-only pages to images/...")
                    doc = pymupdf.open(str(pdf_file))
                    for pg_num in visual_only_pages:
                        if pg_num < len(doc):
                            page = doc[pg_num]
                            # Try extracting the embedded image directly
                            page_images = page.get_images()
                            extracted = False
                            if len(page_images) == 1:
                                try:
                                    xref = page_images[0][0]
                                    img_data = doc.extract_image(xref)
                                    img_name = f"{pdf_file.stem}-{pg_num:04d}-fullpage.{img_data['ext']}"
                                    (images_dir / img_name).write_bytes(img_data["image"])
                                    extracted = True
                                except Exception:
                                    pass
                            if not extracted:
                                pix = page.get_pixmap(dpi=dpi)
                                img_name = f"{pdf_file.stem}-{pg_num:04d}-fullpage.{image_format}"
                                pix.save(str(images_dir / img_name))
                    doc.close()
                    print(f"    ✓ {len(visual_only_pages)} visual-only pages saved to images/")

            # Render pages as images if requested
            if pages_as_images or pages_as_images_only:
                print(f"    Rendering pages as images ({page_image_dpi} dpi)...")
                rendered = render_pages_as_images(
                    pdf_file=pdf_file,
                    output_dir=page_images_dir,
                    dpi=page_image_dpi,
                    image_format=page_image_format,
                    pages=pages,
                    global_page_offset=global_page,
                )
                print(f"    ✓ {rendered} page images saved")

                # For images-only mode, update counters and skip text extraction
                if pages_as_images_only:
                    pdf_pages = rendered
                    # Map classifications to global page numbers
                    pages_list = pages if pages else list(range(rendered))
                    for idx, local_pn in enumerate(pages_list[:rendered]):
                        gp = global_page + idx + 1
                        if local_pn in pdf_classifications:
                            page_classifications[gp] = pdf_classifications[local_pn]
                    global_page += rendered
                    page_mapping.append({
                        "pdf_file": pdf_file.name,
                        "total_pages": total_pdf_pages,
                        "processed_pages": pdf_pages,
                        "local_pages": f"1-{pdf_pages}" if not pages else f"{len(pages)} selected",
                        "global_pages": f"{pdf_start}-{global_page}",
                        "mode": "images_only",
                    })
                    continue  # Skip text extraction

            # Text extraction (skip if images-only mode)
            # Get header detection if requested
            hdr_info = None
            if use_toc_headers or use_font_headers:
                try:
                    hdr_info = get_header_info(pdf_file, use_toc_headers, use_font_headers)
                except Exception as e:
                    print(f"    Warning: Header detection failed: {e}")
                    hdr_info = None

            # Build conversion arguments
            convert_args = {
                "doc": str(pdf_file),
                # Image settings
                "write_images": not skip_images and not embed_images,
                "embed_images": embed_images,
                "image_path": str(images_dir) if not skip_images and not embed_images else None,
                "image_format": image_format,
                "dpi": dpi,
                "image_size_limit": image_size_limit,
                "ignore_images": skip_images,
                # Text settings
                "header": include_headers,
                "footer": include_footers,
                "force_text": force_text,
                "ignore_code": ignore_code,
                # Table settings
                "table_strategy": table_strategy,
                # Structure settings
                "page_chunks": True,  # Always get per-page data for mapping
                "show_progress": True,
            }

            # Add header info if available
            if hdr_info:
                convert_args["hdr_info"] = hdr_info

            # Add OCR settings if enabled
            if use_ocr:
                convert_args["use_ocr"] = True
                convert_args["ocr_language"] = ocr_language
                convert_args["ocr_dpi"] = ocr_dpi

            # Add page filter if specified
            if pages:
                convert_args["pages"] = pages

            # Convert to markdown
            pages_list = pages if pages else list(range(total_pdf_pages))
            failed_pages = []

            # Define chunk size for batch processing (smaller chunks = better error isolation)
            CHUNK_SIZE = 50

            try:
                result = pymupdf4llm.to_markdown(**convert_args)
            except Exception as batch_err:
                # Batch failed (e.g. pymupdf table.bbox bug on one page).
                # Common cause: ValueError: min() arg is an empty sequence
                # This happens when PyMuPDF4LLM tries to compute min/max on empty
                # collections (images, tables, drawings) on certain pages.
                #
                # Strategy: Process in chunks to isolate bad pages, avoiding
                # the extreme slowness of pure page-by-page retry.
                print(f"    ⚠ Batch failed: {batch_err}")
                print(f"    Retrying with {CHUNK_SIZE}-page chunks (faster than page-by-page)...")

                result = []
                total_chunks = (len(pages_list) + CHUNK_SIZE - 1) // CHUNK_SIZE

                for chunk_idx in range(total_chunks):
                    start = chunk_idx * CHUNK_SIZE
                    end = min(start + CHUNK_SIZE, len(pages_list))
                    chunk_pages = pages_list[start:end]

                    chunk_args = dict(convert_args)
                    chunk_args["pages"] = chunk_pages
                    chunk_args["show_progress"] = False

                    try:
                        chunk_result = pymupdf4llm.to_markdown(**chunk_args)
                        result.extend(chunk_result)
                        print(f"      Chunk {chunk_idx + 1}/{total_chunks} (pages {start + 1}-{end}): OK")
                    except Exception as chunk_err:
                        # Chunk failed - drill down to individual pages in this chunk
                        print(f"      Chunk {chunk_idx + 1}/{total_chunks} (pages {start + 1}-{end}): FAILED, drilling down...")
                        for pg in chunk_pages:
                            page_args = dict(convert_args)
                            page_args["pages"] = [pg]
                            page_args["show_progress"] = False
                            try:
                                page_result = pymupdf4llm.to_markdown(**page_args)
                                result.extend(page_result)
                            except (ValueError, Exception) as page_err:
                                failed_pages.append(pg + 1)
                                # Check if it's the known min() error
                                if isinstance(page_err, ValueError) and "min()" in str(page_err):
                                    error_type = "min() bug (likely empty tables/images)"
                                else:
                                    error_type = type(page_err).__name__
                                print(f"        ⚠ Page {pg + 1} failed ({error_type})")

                                # Render failed page as image so content isn't lost
                                fallback_text = f"\n\n<!-- PAGE {pg + 1}: text extraction failed ({error_type}), rendered as image -->\n\n"
                                try:
                                    doc = pymupdf.open(str(pdf_file))
                                    pix = doc[pg].get_pixmap(dpi=dpi)
                                    img_name = f"{pdf_file.stem}-page{pg + 1:04d}-fallback.png"
                                    img_path = images_dir / img_name
                                    images_dir.mkdir(parents=True, exist_ok=True)
                                    pix.save(str(img_path))
                                    doc.close()
                                    fallback_text += f"![Page {pg + 1}]({img_path.name})\n\n"
                                except Exception:
                                    pass
                                result.append({"text": fallback_text})

                if failed_pages:
                    print(f"    ⚠ {len(failed_pages)} pages failed: {failed_pages}")

            # Process results
            pdf_pages = len(result)

            for idx, page_data in enumerate(result):
                text = page_data["text"] if isinstance(page_data, dict) else str(page_data)
                all_markdown.append(text)
                global_page += 1

                # Map classification to global page number
                local_pn = pages_list[idx] if idx < len(pages_list) else idx
                if local_pn in pdf_classifications:
                    page_classifications[global_page] = pdf_classifications[local_pn]

                # Save individual page if requested
                if save_page_chunks:
                    pages_dir = markdown_dir / "pages"
                    pages_dir.mkdir(exist_ok=True)
                    page_file = pages_dir / f"page_{global_page:04d}.md"
                    page_file.write_text(text, encoding="utf-8")

            page_mapping.append({
                "pdf_file": pdf_file.name,
                "total_pages": total_pdf_pages,
                "processed_pages": pdf_pages,
                "failed_pages": failed_pages,
                "local_pages": f"1-{pdf_pages}" if not pages else f"{len(pages)} selected",
                "global_pages": f"{pdf_start}-{global_page}",
            })

            if failed_pages:
                print(f"    ✓ {pdf_pages} pages processed ({len(failed_pages)} failed)")
            else:
                print(f"    ✓ {pdf_pages} pages processed")

        except Exception as e:
            print(f"    ✗ ERROR: {e}")
            import traceback
            traceback.print_exc()
            continue

    # Build image-to-page mapping
    # PyMuPDF4LLM filenames: {pdf_name}-{PAGE_0indexed:04d}-{IMG_INDEX:02d}.{ext}
    image_mapping = {}  # page_number (1-indexed) -> [list of image filenames]
    visual_page_renders = {}  # page_number (1-indexed) -> render info
    if not skip_images and not embed_images and images_dir.exists():
        for img_file in sorted(images_dir.glob("*")):
            # Full-page renders of visual-only pages: {stem}-{PAGE:04d}-fullpage.{ext}
            fullpage_match = re.search(r'-(\d{4})-fullpage\.\w+$', img_file.name)
            if fullpage_match:
                page_0idx = int(fullpage_match.group(1))
                page_1idx = page_0idx + 1
                key = str(page_1idx)
                visual_page_renders[key] = {
                    "filename": img_file.name,
                    "type": "fullpage_render",
                    "reason": "visual_only_page",
                }
                if key not in image_mapping:
                    image_mapping[key] = []
                image_mapping[key].append({
                    "filename": img_file.name,
                    "image_index": -1,
                    "type": "fullpage_render",
                })
                continue

            # Extracted embedded images: {stem}-{PAGE:04d}-{IMG:02d}.{ext}
            match = re.search(r'-(\d{4})-(\d{2,3})\.\w+$', img_file.name)
            if match:
                page_0idx = int(match.group(1))
                page_1idx = page_0idx + 1  # Convert to 1-indexed
                img_idx = int(match.group(2))
                key = str(page_1idx)
                if key not in image_mapping:
                    image_mapping[key] = []
                image_mapping[key].append({
                    "filename": img_file.name,
                    "image_index": img_idx,
                })
        total_images = sum(len(imgs) for imgs in image_mapping.values())
    else:
        total_images = 0

    # Count page images
    total_page_images = 0
    if (pages_as_images or pages_as_images_only) and page_images_dir.exists():
        total_page_images = len(list(page_images_dir.glob("*")))

    # Write full markdown (skip if images-only mode)
    full_text_size = 0
    if not pages_as_images_only:
        print(f"\nWriting markdown...")
        full_text = "\n\n---\n\n".join(all_markdown)
        full_text_file = markdown_dir / "full_text.md"
        full_text_file.write_text(full_text, encoding="utf-8")
        full_text_size = full_text_file.stat().st_size / 1024  # KB
    else:
        print(f"\nImages-only mode: skipping markdown output")

    # Build content summary from classifications
    content_summary = {
        "total_classified": len(page_classifications),
        "by_type": {
            "text": sum(1 for c in page_classifications.values() if c["content_type"] == "text"),
            "visual": sum(1 for c in page_classifications.values() if c["content_type"] == "visual"),
            "mixed": sum(1 for c in page_classifications.values() if c["content_type"] == "mixed"),
            "empty": sum(1 for c in page_classifications.values() if c["content_type"] == "empty"),
        },
        "pages_with_images": sum(1 for c in page_classifications.values() if c["has_images"]),
        "pages_with_drawings": sum(1 for c in page_classifications.values() if c["has_drawings"]),
        "pages_with_tables": sum(1 for c in page_classifications.values() if c["has_tables"]),
    }

    # Build per-page content data (page_num -> classification)
    # Convert int keys to strings for JSON
    page_content = {
        str(k): v for k, v in sorted(page_classifications.items())
    }

    # Write metadata
    metadata = {
        "book_name": book_name,
        "total_pages": global_page,
        "image_count": total_images,
        "page_image_count": total_page_images,
        "images_embedded": embed_images,
        "mode": "images_only" if pages_as_images_only else "text" + ("+images" if pages_as_images else ""),
        "pdf_files": [f.name for f in pdf_files],
        "page_mapping": page_mapping,
        "content_summary": content_summary,
        "page_content": page_content,
        "image_mapping": image_mapping,
        "visual_page_renders": visual_page_renders,
        "settings": {
            "dpi": dpi,
            "image_format": image_format,
            "image_size_limit": image_size_limit,
            "table_strategy": table_strategy,
            "headers_method": "toc" if use_toc_headers else ("font" if use_font_headers else "default"),
            "ocr": use_ocr,
            "ocr_language": ocr_language if use_ocr else None,
            "ocr_dpi": ocr_dpi if use_ocr else None,
            "include_headers": include_headers,
            "include_footers": include_footers,
            "force_text": force_text,
            "ignore_code": ignore_code,
            "page_range": page_range_str,
            "pages_as_images": pages_as_images,
            "pages_as_images_only": pages_as_images_only,
            "page_image_dpi": page_image_dpi if (pages_as_images or pages_as_images_only) else None,
            "page_image_format": page_image_format if (pages_as_images or pages_as_images_only) else None,
        },
        "preprocessed_at": datetime.now().isoformat(),
        "pymupdf4llm_version": getattr(pymupdf4llm, "__version__", "unknown"),
        "pymupdf_version": getattr(pymupdf, "__version__", "unknown"),
    }

    metadata_file = output_path / "metadata.json"
    metadata_file.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    # Print summary
    print(f"\n{'='*60}")
    print(f"PREPROCESSING COMPLETE")
    print(f"{'='*60}")
    print(f"Book: {book_name}")
    print(f"Pages: {global_page}")
    if total_page_images > 0:
        print(f"Page images: {total_page_images}")
    if not pages_as_images_only:
        print(f"Embedded images: {total_images}" + (" (base64)" if embed_images else ""))
        print(f"Markdown: {full_text_size:.1f} KB")
    print(f"")
    # Content detection summary
    if page_classifications:
        cs = content_summary
        print(f"Content Detection:")
        print(f"  Text-only pages:    {cs['by_type']['text']}")
        print(f"  Mixed pages:        {cs['by_type']['mixed']}")
        print(f"  Visual-only pages:  {cs['by_type']['visual']}")
        print(f"  Empty pages:        {cs['by_type']['empty']}")
        print(f"  Pages with images:  {cs['pages_with_images']}")
        print(f"  Pages with drawings:{cs['pages_with_drawings']}")
        print(f"  Pages with tables:  {cs['pages_with_tables']}")
        if cs["by_type"]["visual"] > 0:
            print(f"")
            scanned = cs["by_type"]["visual"] > cs["total_classified"] * 0.5
            if scanned:
                print(f"  ⚠ SCANNED PDF: {cs['by_type']['visual']}/{cs['total_classified']} pages are visual-only")
                print(f"    Re-run with --ocr for text extraction or --pages-as-images for AI vision")
            elif visual_page_renders:
                render_pages = ", ".join(visual_page_renders.keys())
                print(f"  ✓ {cs['by_type']['visual']} visual-only pages extracted to images/ (pages: {render_pages})")
            else:
                print(f"  ⚠ {cs['by_type']['visual']} visual-only pages (no extractable text)")
                print(f"    Re-run with --ocr or --pages-as-images")
    if image_mapping:
        print(f"")
        print(f"Image Mapping: {total_images} images across {len(image_mapping)} pages")
    print(f"")
    print(f"Output:")
    print(f"  {output_path}/")
    if not pages_as_images_only:
        print(f"  ├── markdown/")
        print(f"  │   └── full_text.md")
        if save_page_chunks:
            print(f"  │   └── pages/ ({global_page} files)")
        if not skip_images and not embed_images:
            print(f"  ├── images/ ({total_images} files)")
    if total_page_images > 0:
        print(f"  ├── page_images/ ({total_page_images} files)")
    print(f"  └── metadata.json")
    print(f"")
    if pages_as_images_only:
        print(f"Next step:")
        print(f"  Use AI vision to read page images")
        print(f"  Example: analyze_image(page_images/page_0001.png)")
    else:
        print(f"Next step:")
        print(f"  /book-learn-markdown {output_path}")
    print(f"{'='*60}\n")

    return metadata


def main():
    args = parse_args()

    # Resolve paths
    input_path = Path(args.input_path).resolve()

    if args.output:
        output_dir = Path(args.output).resolve()
    else:
        output_dir = Path("data/books").resolve()

    # Get PDF files
    pdf_files, book_name = get_pdf_files(input_path)

    print(f"Found {len(pdf_files)} PDF file(s)")
    for f in pdf_files:
        print(f"  - {f.name}")

    # Handle force_text toggle
    force_text = True
    if args.no_force_text:
        force_text = False

    # Run preprocessing
    preprocess_book(
        pdf_files=pdf_files,
        book_name=book_name,
        output_dir=output_dir,
        dpi=args.dpi,
        image_format=args.image_format,
        skip_images=args.skip_images,
        embed_images=args.embed_images,
        image_size_limit=args.image_size_limit,
        use_toc_headers=args.use_toc_headers,
        use_font_headers=args.use_font_headers,
        include_headers=not args.no_headers,
        include_footers=not args.no_footers,
        force_text=force_text,
        ignore_code=args.ignore_code,
        table_strategy=args.table_strategy,
        use_ocr=args.ocr,
        ocr_language=args.ocr_language,
        ocr_dpi=args.ocr_dpi,
        page_range_str=args.pages,
        save_page_chunks=args.page_chunks,
        pages_as_images=args.pages_as_images,
        pages_as_images_only=args.pages_as_images_only,
        page_image_format=args.page_image_format,
        page_image_dpi=args.page_image_dpi,
    )

    # Move source PDF into preprocessed book folder
    # When book-learn-markdown later moves the whole folder to processed/, the PDF goes with it
    book_output_dir = output_dir / book_name
    for pdf in pdf_files:
        dest = book_output_dir / pdf.name
        if not dest.exists():
            shutil.move(str(pdf), str(dest))
            print(f"Source moved to: {dest}")


if __name__ == "__main__":
    main()
