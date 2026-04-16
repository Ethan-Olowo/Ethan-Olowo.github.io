import ProjectCard from "./ProjectCard";

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  slug: string;
};

type ProjectCardRendererProps = {
  item: ProjectCardProps;
  index: number;
};

export default function ProjectCardRenderer({ item, index }: ProjectCardRendererProps) {
  return (
    <ProjectCard
      title={item.title}
      description={item.description}
      tags={item.tags}
      githubUrl={item.githubUrl}
      liveUrl={item.liveUrl}
      index={index}
      slug={item.slug}
    />
  );
}
