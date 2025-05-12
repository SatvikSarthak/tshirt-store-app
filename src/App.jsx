import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  {
    bg: "bg-gradient-to-br from-gray-100 to-gray-300",
    accent: "border-gray-500 focus:ring-gray-400", 
  },
  {
    bg: "bg-gradient-to-br from-indigo-100 to-indigo-300",
    accent: "border-indigo-500 focus:ring-indigo-400", 
  },
  {
    bg: "bg-gradient-to-br from-emerald-100 to-emerald-300",
    accent: "border-emerald-500 focus:ring-emerald-400",
  },
  {
    bg: "bg-gradient-to-br from-orange-100 to-yellow-200",
    accent: "border-yellow-500 focus:ring-yellow-400", 
  },
];
const FloatingInput = ({
  label,
  register,
  name,
  themeClass,
  type = "text",
  options,
}) => (
  <div className="relative w-full">
    <input
      {...register(name, options)}
      type={type}
      placeholder=" "
      className={`peer w-full border-2 rounded-lg px-3 pt-5 pb-2 bg-white text-sm ${themeClass} focus:outline-none focus:ring-2 focus:ring-offset-2`}
    />
    <label className="absolute left-3 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">
      {label}
    </label>
  </div>
);

function App() {
  const [theme, setTheme] = useState(0);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === "image/png") {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      toast.error("Only PNG files are allowed.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    toast.success("Form submitted!");
  };

  const switchTheme = () => {
    setTheme((prev) => (prev + 1) % themes.length);
  };

  const randomTheme = () => {
    const rand = Math.floor(Math.random() * themes.length);
    setTheme(rand);
    toast(`Random theme selected: ${rand + 1}`);
  };

  useEffect(() => {
    toast.success(`Theme switched to ${theme + 1}`);
  }, [theme]);

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`min-h-screen px-6 sm:px-16 py-12 ${themes[theme].bg} transition-all`}
        >
          <div className="max-w-3xl mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/60">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 tracking-tight">
              Design Your Tee
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <FloatingInput
                  label="Height in cm"
                  name="height"
                  register={register}
                  themeClass={themes[theme].accent}
                  options={{ required: "Height is required" }}
                />
                {errors.height && (
                  <p className="text-red-500 text-sm">
                    {errors.height.message}
                  </p>
                )}

                <FloatingInput
                  label="Width"
                  name="width"
                  register={register}
                  themeClass={themes[theme].accent}
                  options={{ required: "Width is required" }}
                />

                {errors.width && (
                  <p className="text-red-500 text-sm">{errors.width.message}</p>
                )}
              </div>

              <FloatingInput
                label="T-Shirt Text"
                name="shirtText"
                register={register}
                themeClass={themes[theme].accent}
              />

              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-400/70 bg-white/60 hover:bg-white/80 transition p-6 rounded-xl text-center cursor-pointer"
              >
                <input {...getInputProps()} />
                <p className="text-gray-500 font-medium">
                  Drag & drop a PNG image or click to browse
                </p>
              </div>

              <div className="text-center mt-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className={`px-6 py-2 rounded-xl text-blue-950 font-medium shadow-md transition-all duration-200 ${themes[
                    theme
                  ].accent.replace("border-", "bg-")} hover:opacity-90`}
                >
                  Submit Design
                </motion.button>
              </div>
            </form>

            {preview && (
              <div className="mt-10 flex justify-center relative">
                <img
                  src={preview}
                  className="w-[28%] min-w-[200px] h-auto mx-auto"
                />
                {watch("shirtText") && (
                  <div className="absolute top-1/2 left-1/2 w-full text-center transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-black/70 pointer-events-none px-2">
                    {watch("shirtText")
                      .split("\n")
                      .slice(0, 3)
                      .map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={switchTheme}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Next Theme
              </button>
              <button
                onClick={randomTheme}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
              >
                Random Theme
              </button>
              <button
                onClick={() => {
                  reset();
                  setPreview(null);
                  toast("Form reset");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
