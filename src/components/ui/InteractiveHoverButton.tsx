import React from "react"
import { ArrowRight } from "lucide-react"

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  variant?: "primary" | "secondary"
  as?: "button" | "div"
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", variant = "primary", className = "", as = "button", ...props }, ref) => {
  const baseClasses = "group relative cursor-pointer overflow-hidden rounded-full border p-2 text-center font-semibold transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
  
  const variantClasses = variant === "primary"
    ? "text-white"
    : "bg-white border-gray-300 text-gray-800"
  
  const primaryStyle = variant === "primary" ? { backgroundColor: '#4E4D50', borderColor: '#4E4D50' } : {}

  const content = (
    <>
      <span className="relative z-10 inline-block transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-1 group-hover:opacity-100">
        <span className="text-gray-800">Let's Go</span>
        <ArrowRight className="w-4 h-4 text-gray-800 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-gray-200 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-gray-200 group-hover:opacity-100"></div>
    </>
  )

  if (as === "div") {
    return (
      <div
        className={`${baseClasses} ${variantClasses} ${className}`}
        style={primaryStyle}
        {...(props as any)}
      >
        {content}
      </div>
    )
  }

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={primaryStyle}
      {...props}
    >
      {content}
    </button>
  )
})

InteractiveHoverButton.displayName = "InteractiveHoverButton"

export { InteractiveHoverButton }

