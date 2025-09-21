import { 
  createBlog, 
  getAllBlogPostOfMyself, 
  getBlog, 
  updateBlog,
  getAllBlogs,
  deleteBlog
} from "../controllers/blog.controllers";
import { 
  addReviewToProduct,
  updateReviewToProduct,
  deleteReview,
  getReviewsOfBlog
} from "../controllers/comment.controller";
import e from "express";

const route = e.Router();

route.get("/my-blogs", getAllBlogPostOfMyself);
route.get("/all", getAllBlogs);
route.get("/:slug", getBlog); 
route.post("/", createBlog);
route.put("/:id", updateBlog);
route.delete("/:id", deleteBlog);

route.post("/:blogSlug/comments", addReviewToProduct);
route.put("/:blogSlug/comments", updateReviewToProduct);
route.get("/:blogSlug/comments", getReviewsOfBlog);
route.delete("/comments/:reviewId", deleteReview);

export default route;