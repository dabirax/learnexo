import { useRef, useState } from "react";
import avatar from "../../../assets/images/avatar.png";
import { Camera, Plus } from "lucide-react";

type ImagePlaceholderProps = {
  setSelected: (file: File | null) => void;
};

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ setSelected }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelected(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group cursor-pointer" onClick={handleFileClick}>
        <div className="absolute -inset-2 border-2 border-dashed border-slate-200 rounded-full group-hover:border-violet-400 group-hover:rotate-12 transition-all duration-500" />

        <div className="relative w-28 h-28 mlg:w-32 mlg:h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center transition-transform active:scale-95">
          {previewImage ? (
            <img
              src={previewImage}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <img
                src={avatar}
                alt="Upload"
                className="w-12 h-12 mlg:w-16 mlg:h-16 opacity-40 group-hover:opacity-60 transition-opacity"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-violet-600/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera size={24} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {previewImage ? "Change" : "Upload"}
            </span>
          </div>
        </div>

        {!previewImage && (
          <div className="absolute bottom-1 right-1 bg-violet-600 text-white p-1.5 rounded-full border-4 border-white shadow-lg">
            <Plus size={14} strokeWidth={3} />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImagePlaceholder;
