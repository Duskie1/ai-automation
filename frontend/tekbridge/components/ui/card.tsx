"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: "0 8px 30px -6px rgba(0,0,0,0.1)" } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={clsx(
        "bg-white border border-border rounded-xl p-6",
        hover && "cursor-pointer transition-all",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card className={clsx("text-center", className)}>
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-bg-alt text-accent-brand">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-faint">{description}</p>
    </Card>
  );
}

interface StatCardProps {
  value: string | ReactNode;
  label: string;
  valueColor?: string;
  className?: string;
}

export function StatCard({ value, label, valueColor = "text-red", className }: StatCardProps) {
  return (
    <Card className={clsx("text-center", className)}>
      <div className={clsx("text-4xl md:text-5xl font-bold mb-2", valueColor)}>
        {value}
      </div>
      <p className="text-sm text-text-faint">{label}</p>
    </Card>
  );
}
