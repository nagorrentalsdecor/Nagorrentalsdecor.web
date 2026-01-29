import { cn } from "@/lib/utils";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
    center?: boolean;
}

const SectionTitle = ({ title, subtitle, className, center = true }: SectionTitleProps) => {
    return (
        <div className={cn("mb-12", center && "text-center", className)}>
            {subtitle && (
                <h4 className="text-primary font-medium tracking-widest uppercase mb-2 text-sm md:text-base">
                    {subtitle}
                </h4>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-secondary relative inline-block">
                {title}
                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
            </h2>
        </div>
    );
};

export default SectionTitle;
