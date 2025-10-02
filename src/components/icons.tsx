export function Logo(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        aria-label="SortWise logo"
        width="32"
        height="32"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect x="10" y="70" width="15" height="20" fill="hsl(var(--primary))" rx="4" />
        <rect x="30" y="50" width="15" height="40" fill="hsl(var(--primary))" rx="4" />
        <rect x="50" y="30" width="15" height="60" fill="hsl(var(--primary))" rx="4" />
        <rect x="70" y="10" width="15" height="80" fill="hsl(var(--primary))" rx="4" />
      </svg>
    );
  }
