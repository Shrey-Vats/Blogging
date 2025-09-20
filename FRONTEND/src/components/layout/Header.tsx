import { useAuth } from "@/hook/AuthProvider";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function Header() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const handleCreateBlog = () => {
    navigate("/create");
  };
  return (
    <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-200">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Blogging Platform
        </h1>
        {user && (
          <p className="text-muted-foreground mt-1">Welcome, {user.name}!</p>
        )}
      </div>
      <div className="flex gap-4">
        <Button
          onClick={handleCreateBlog}
          className="bg-primary hover:bg-primary/90"
        >
          Create Blog
        </Button>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default Header;
