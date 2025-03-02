// No props needed for the Navbar component as it's a self-contained component
export type NavbarProps = Record<string, never>;

// Type for navigation items
export interface NavItem {
  name: string;
  href: string;
  requiresAuth: boolean;
}

// Type for mobile menu state
export interface MobileMenuState {
  isOpen: boolean;
} 