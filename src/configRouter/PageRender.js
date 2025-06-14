import { useParams } from "react-router-dom";
import NotFound from "../pages/NotFound";
import React from "react";

function PageRender() {
    const { page, id } = useParams();
    const pageName = id
        ? `${page?.replace(/\w/, page?.charAt(0).toUpperCase())}/[id]`
        : page?.replace(/\w/, page?.charAt(0).toUpperCase()); // Convert the first letter lowercase to the first letter uppercase

    try {
        const PageComponent = require(`../pages/${pageName}`).default;
        return <PageComponent />;
    } catch (error) {
        return <NotFound />;
    }
}

export default PageRender;
