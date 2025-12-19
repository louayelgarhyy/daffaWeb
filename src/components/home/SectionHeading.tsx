interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeading = ({
  title,
  subtitle,
  align = 'left'
}: SectionHeadingProps) => {
  return (
    <div className={`mb-8 ${align === 'center' ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
