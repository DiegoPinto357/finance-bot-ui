import { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';

const SubMenuItem = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'a'>) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{children}</div>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

export default SubMenuItem;
