import { PassageUser } from "@passageidentity/passage-elements/passage-user";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {

  const router = useRouter();
  
  const signOut = async () => {
    new PassageUser().signOut();
    router.push("/");
  };

  
  return (
    <header className="text-gray-600 body-font shadow-md">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/dashboard" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span className="ml-3 text-xl">Odyssey</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link className="mr-5 hover:text-gray-900" href="/journal/new">
            New Journal
          </Link>
          <Link className="mr-5 hover:text-gray-900" href="/profile"> Profile </Link>

          <button className="mr-5 hover:text-gray-900" onClick={signOut}>
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
