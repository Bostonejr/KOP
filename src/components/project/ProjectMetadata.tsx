/**
 * ProjectMetadata Component - Project Info Sidebar
 *
 * Displays project metadata in a vertical list:
 * - Status: Design / In Progress / Completed
 * - Location: City name (e.g., Accra, Cape Coast)
 * - Period: Year (e.g., 2023)
 *
 * This appears on the right side of the project detail page
 * (on desktop) or below the description (on mobile).
 */

interface ProjectMetadataProps {
  status: string;    // Project status
  location: string;  // Project location
  period: string;    // Year or time period
}

const ProjectMetadata: React.FC<ProjectMetadataProps> = ({
  status,
  location,
  period,
}) => {
  // Metadata items as an array for easier rendering
  const metaItems = [
    { label: 'Status:', value: status },
    { label: 'Location:', value: location },
    { label: 'Period:', value: period },
  ];

  return (
    <div className="space-y-6">
      {metaItems.map((item) => (
        <div key={item.label}>
          {/* Label */}
          <h4 className="
            font-sans text-sm font-medium text-charcoal
            mb-1
          ">
            {item.label}
          </h4>
          {/* Value */}
          <p className="
            font-sans text-sm text-charcoal/70
          ">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProjectMetadata;
