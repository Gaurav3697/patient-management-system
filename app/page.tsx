import PatientForm from "@/components/forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import { ModeToggle } from "@/components/theme-switcher"
import Image from "next/image";


export default function Home() {
  return (
    <div className="h-screen max-h-screen">

      {/* //toogle theme */}
      <div className="ml-2 mt-2 absolute">
        <ModeToggle />
      </div>

      {/*OTP verification */}
            <PassKeyModal />  

      <div className="flex">
        <section className="remove-scrollbar container my-auto ">
          <div className="sub-container max-w-[496px]">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
            />
            <PatientForm />
          </div>
        </section>

        {/* IMAGE SECTION */}
        <Image
          src={"/assets/images/onboarding-img.png"}
          height={1000}
          width={1000}
          alt="patient"
          className="max-w-[50%] hidden h-screen object-cover md:block rounded-xl"
        />
      </div>


    </div>
  );
}
