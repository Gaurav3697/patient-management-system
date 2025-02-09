import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
// import { ModeToggle } from "@/components/theme-switcher"
import Image from "next/image";


const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);
  console.log(patient)
  return (
    <div className="h-screen max-h-screen">

      {/* //toogle theme
        <div className="ml-2 mt-2 absolute">
          <ModeToggle />
      </div> */}


      <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto ">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image 
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          /> 
          {
            patient ? (<AppointmentForm
              type="create"
              userId={userId}
              patientId={patient.$id}/>):("loading")
          }
        </div>
      </section>

      {/* IMAGE SECTION */}
      <Image 
        src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt="appointment"
        className="mside-img max-w-[390px] bg-buttom"
      />
      </div>

    </div>
  );
}

export default NewAppointment;