import Link from "next/link";
import { FileText } from "lucide-react";
import { GitHubStarsButton } from "@/components/animate-ui/buttons/github-stars";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-10 md:px-24">
      <Link href="/">
        <div className="flex items-center gap-2">
          <FileText
            size={36}
            className="hover:rotate-12 tranform transition-all duration-200 ease-in-out "
          />
          <span className="font-extrabold text-[22px] text-gray-900">
            Readme.ai
          </span>
        </div>
      </Link>
      <div>
        <GitHubStarsButton username="LakshitAgarwal" repo="Readme-Generator" />
      </div>
    </div>
  );
}
