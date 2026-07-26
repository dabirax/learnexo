import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourses, type ContentItem } from "@/utils/queries/courses";
import { Play, Headphones, BookOpen, FileText, Layers } from "lucide-react";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

const CoursesLoading = () => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-6">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
      <BookOpen size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600" />
    </div>
    <div className="text-center">
      <p className="text-slate-900 font-semibold text-lg">Loading Courses...</p>
      <p className="text-slate-500 text-sm mt-1">Fetching your recommended learning materials</p>
    </div>
  </div>
);

const typeIcons: Record<string, React.ReactNode> = {
  video: <Play size={20} />,
  audio: <Headphones size={20} />,
  text: <BookOpen size={20} />,
  interactive: <FileText size={20} />,
};

const typeLabels: Record<string, string> = {
  video: "Video",
  audio: "Audio",
  text: "Book",
  interactive: "Interactive",
};

const defaultCovers: Record<string, string> = {
  video: "bg-red-100 text-red-600",
  audio: "bg-amber-100 text-amber-600",
  text: "bg-blue-100 text-blue-600",
  interactive: "bg-green-100 text-green-600",
};

const ContentCard = ({ item }: { item: ContentItem }) => {
  const handleClick = () => {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex-shrink-0 w-64 bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group ${item.url ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className={`h-36 flex items-center justify-center ${defaultCovers[item.type] ?? "bg-slate-100 text-slate-600"}`}>
        {typeIcons[item.type] ?? <BookOpen size={32} />}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {typeLabels[item.type] ?? item.type}
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 capitalize">
            {item.category}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 capitalize">{item.topic.replace(/_/g, " ")}</p>
        {item.subject && (
          <p className="text-xs text-slate-400 mt-0.5 capitalize">{item.subject}</p>
        )}
      </div>
    </div>
  );
};

const SectionCarousel = ({ title, items }: { title: string; items: ContentItem[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Layers size={18} className="text-violet-600" />
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const Courses = () => {
  useDocumentTitle("Courses");
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (isLoading) return <CoursesLoading />;

  if (!data || (!data.recent.length && !Object.keys(data.bySubject).length)) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
        <BookOpen size={48} className="text-slate-300" />
        <p className="text-slate-500 dark:text-slate-400 text-lg">No recommended content yet.</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm">Complete an assessment to get AI-recommended learning materials.</p>
      </div>
    );
  }

  const subjectNames = Object.keys(data.bySubject);
  const activeSubject = selectedSubject || subjectNames[0];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto p-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Subjects</h2>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedSubject(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSubject === null ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Content
          </button>
          {subjectNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedSubject(name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeSubject === name ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Courses</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">AI-recommended learning materials tailored to your weak topics.</p>
          </div>

          {selectedSubject === null ? (
            <>
              <SectionCarousel title="Recent Recommendations" items={data.recent.slice(0, 10)} />
              {subjectNames.map((subject) => (
                <SectionCarousel key={subject} title={subject.charAt(0).toUpperCase() + subject.slice(1)} items={data.bySubject[subject]} />
              ))}
            </>
          ) : (
            <SectionCarousel title={selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} items={data.bySubject[selectedSubject] || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
