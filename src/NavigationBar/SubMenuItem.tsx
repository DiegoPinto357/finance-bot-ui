import { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';

const SubMenuItem = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Link>) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{children}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default SubMenuItem;
