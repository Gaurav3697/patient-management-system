
import Image from 'next/image';
import React from 'react';
import RegisterForm from '@/components/forms/RegisterForm';
import { getUser } from '@/lib/actions/patient.actions';

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className="h-screen max-h-screen">
      {/* OTP Verification */}
      <div className="flex">
        <section className="remove-scrollbar container my-auto">
          <div className="sub-container max-w-[496px]">
            <Image 
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
            /> 

            {
              user ? (<RegisterForm user={user} />) : (<p>Loading</p>)
            }
          </div>
        </section>

        {/* IMAGE SECTION */}
        <Image 
          src="/assets/images/register-img.png"
          height={1000}
          width={1000}
          alt="patient"
          className="max-w-[40%] hidden h-screen object-cover md:block rounded-xl"
        />
      </div>
    </div>
  );
}

export default Register;