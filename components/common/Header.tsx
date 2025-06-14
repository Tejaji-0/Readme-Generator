import Link from "next/link";
import { FileText, Github } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-10 px-24">
      <div className="flex items-center gap-2">
        <Link href="/">
          <FileText
            size={36}
            className="hover:rotate-12 tranform transition-all duration-200 ease-in-out "
          />
        </Link>
        <span className="font-extrabold text-[22px] text-gray-900">Readme.ai</span>
      </div>
      <div>
        <Link href="https://github.com/LakshitAgarwal" target="_blank">
          <Github size={36} />
        </Link>
      </div>
    </div>
  );
}
