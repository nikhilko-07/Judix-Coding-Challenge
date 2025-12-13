
import React, {useState} from "react";
import ClientLayout from "@/Layout/ClientLayout";
import { createAPost } from "@/config/redux/action/postAction";
import {useDispatch} from "react-redux";
import style from "./styel.module.css";

export default function createPost(){
    const dispatch = useDispatch();
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);

    const handleFilesChange = (e) => {
        const selected = Array.from(e.target.files || []);
        setFiles(selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert("Content is required");
            return;
        }
        if (!files.length) {
            alert("Please select at least one image");
            return;
        }

        dispatch(createAPost({ content, files }));
    };

    return(<ClientLayout>
        <div className={style.wrapperDiv}>
            <form
                onSubmit={handleSubmit}
                className={style.form}
            >
                <h1 className={style.header}>Create Post</h1>
  <textarea
      placeholder="What's on your mind?"
      value={content}
      className={style.textArea}
      onChange={(e) => setContent(e.target.value)}
      rows={4}

  />

                <label
                    className={style.label}

                >
    <span
        className={style.addImages}
    >
      + Add images
    </span>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFilesChange}
                        style={{ display: "none" }}       // hide default ugly input
                    />
                    {files.length > 0 && (
                        <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
        {files.length} selected
      </span>
                    )}
                </label>

                <button
                    className={style.submitBtn}
                    type="submit"

                >
                    Create Post
                </button>
            </form>
        </div>

    </ClientLayout>)
}