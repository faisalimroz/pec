import React from 'react';

interface NavLink {
  title: string;
  href: string;
  logo?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NewNavbarProps {
  links: NavLink[];
}

const NewNavbar: React.FC<NewNavbarProps> = ({ links }) => {
  return (
    <nav className=" bg-blue flex  items-center h-auto px-10 py-3">
      {links.map((link) => (
        <a key={link.title} href={link.href} className="flex flex-1 items-center rounded-md gap-2 py-2 px-4 text-sm font-semibold text-white hover:bg-gray">
          {link.logo && <link.logo className='h-4 w-4' />}
          <span>{link.title}</span>
        </a>
      ))}
    </nav>
  );
};

export default NewNavbar;