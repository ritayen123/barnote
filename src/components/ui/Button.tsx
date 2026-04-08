"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const base = "rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent text-bg-primary hover:bg-accent-hover active:scale-[0.98]",
    secondary: "bg-bg-card text-text-primary border border-border hover:border-accent active:scale-[0.98]",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
