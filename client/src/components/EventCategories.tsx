import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

const colorMap: Record<string, string> = {
  'primary': 'bg-primary/10 text-primary',
  'secondary': 'bg-secondary/10 text-secondary',
  'accent': 'bg-accent/10 text-accent',
  'green': 'bg-green-100 text-green-600',
  'purple': 'bg-purple-100 text-purple-600',
  'blue': 'bg-blue-100 text-blue-600',
  'red': 'bg-red-100 text-red-600'
};

const EventCategories = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 mt-8">
        <Skeleton className="h-8 w-56 mb-4" />
        <div className="overflow-x-auto scrollbar-hide py-4">
          <div className="flex space-x-4">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
                <Skeleton className="mt-2 h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 mt-8">
      <h2 className="text-xl md:text-2xl font-bold font-poppins">Browse Events By Category</h2>
      
      <div className="overflow-x-auto scrollbar-hide py-4">
        <div className="flex space-x-4 min-w-max">
          {categories.map((category: Category) => (
            <Link key={category.id} href={`/?category=${category.id}`}>
              <div className="flex flex-col items-center cursor-pointer">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${colorMap[category.color] || 'bg-primary/10 text-primary'} flex items-center justify-center`}>
                  <i className={`fas ${category.icon} text-xl`}></i>
                </div>
                <span className="mt-2 text-xs md:text-sm font-medium">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCategories;
