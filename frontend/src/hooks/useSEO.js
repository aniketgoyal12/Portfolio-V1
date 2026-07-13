import { useEffect } from "react";

export const useSEO = ({ title, description, ogTitle, ogDescription, ogUrl, ogImage }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        const updateMeta = (name, content, isProperty = false) => {
            if (content === undefined || content === null) return;
            const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement("meta");
                if (isProperty) el.setAttribute("property", name);
                else el.setAttribute("name", name);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        updateMeta("description", description);
        updateMeta("og:title", ogTitle || title, true);
        updateMeta("og:description", ogDescription || description, true);
        updateMeta("og:url", ogUrl, true);
        updateMeta("og:image", ogImage, true);
        updateMeta("twitter:title", ogTitle || title);
        updateMeta("twitter:description", ogDescription || description);
        updateMeta("twitter:image", ogImage);
    }, [title, description, ogTitle, ogDescription, ogUrl, ogImage]);
};
