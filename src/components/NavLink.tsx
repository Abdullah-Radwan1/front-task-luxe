import { Link, useMatch } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router' // ✅ type-only import
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface NavLinkCompatProps extends Omit<LinkProps, 'className'> {
  className?: string
  activeClassName?: string
  pendingClassName?: string
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    { className, activeClassName, pendingClassName, to, children, ...props },
    ref,
  ) => {
    const match = useMatch(to as any) // Cast to 'any' to bypass strict type checks
    return (
      <Link
        ref={ref}
        to={to as any}
        className={cn(className, match && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    )
  },
)

NavLink.displayName = 'NavLink'

export { NavLink }
