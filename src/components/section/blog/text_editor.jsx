"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export function TextEditor({ handleBlur, initialValue }) {
  const [value, setValue] = useState(initialValue);

  const modules = useMemo(() => {
    if (typeof window !== "undefined") {
      const { Quill } = require("react-quill-new");
      const ImageResize = require("quill-image-resize-module-react").default;

      if (!Quill.imports["modules/imageResize"]) {
        Quill.register("modules/imageResize", ImageResize);
      }

      return {
        toolbar: [
          [{ font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        imageResize: {
          modules: ["Resize", "DisplaySize"],
        },
      };
    }

    return {};
  }, []);

  useEffect(() => {
    setValue(initialValue);

    return () => {};
  }, [initialValue]);

  return (
    <ReactQuill
      modules={modules}
      theme="snow"
      value={value}
      onChange={setValue}
      onBlur={() => handleBlur(value)}
      placeholder="Compose an epic..."
    />
  );
}
