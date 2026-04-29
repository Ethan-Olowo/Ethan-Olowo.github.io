import BlogCard from "./BlogCard";

type BlogCardProps = {
  title: string;
  description: string;
  readingTime: string;
  tags: string[];
  date?: string;
  coverImage?: string;
  slug: string;
};

type BlogCardRendererProps = {
  item: BlogCardProps;
  index: number;
};

export default function BlogCardRenderer({ item, index }: BlogCardRendererProps) {
  item.date = item.date ? new Date(item.date) : new Date();
  return (
    <BlogCard
      title={item.title}
      description={item.description}
      tags={item.tags}
      date={item.date}
      coverImage={item.coverImage}
      index={index}
      slug={item.slug}
    />
  );
}
