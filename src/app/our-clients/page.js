"use client";
import React from "react";
import Image from "next/image";


const hospitals = [
    {
      id: 1,
      category: "Nephrology",
      name: "Mark International Kidney Center",
      location: "Kathmandu, Nepal",
      logoUrl: "https://danphehealth.com/storage/uploads/CvegKrVeoWfcXC7sMrXLVmB6Vj5ikChWIPZEln7d.png",
    },
    {
      id: 2,
      category: "Central Hospital",
      name: "National Trauma Center (NAMS)",
      location: "Kathmandu, Nepal",
      logoUrl: "https://danphehealth.com/storage/uploads/o5Zhgt2GGub5BUNAydXVUlUETvmRXeGEIvEriLYl.png",
    },
    {
      id: 3,
      category: "Medical College",
      name: "Manipal College of Medical Science",
      location: "Pokhara, Nepal",
      logoUrl: "https://danphehealth.com/storage/uploads/4IY4SO3BaLokN5TATWTijwqOSQvnAq880dX06swm.png",
    },
    {
      id: 4,
      category: "Tertiary Hospital",
      name: "Tilganga Institute of Ophthalmology (Tilganga)",
      location: "Kathmandu, Nepal",
      logoUrl: "https://danphehealth.com/storage/uploads/YRlPFHdotC4yL6OpPwfpJi6W0S8G0kcPNNmvL5JG.png",
    },
    {
      id: 5,
      category: "Central Hospital",
      name: "APF (Armed Police Force) Hospital",
      location: "Kathmandu, Nepal",
      logoUrl: "https://danphehealth.com/storage/uploads/LvNtx7mQtJlbz9ycPe8pQZVoPzLBiFsuMyfRY1Pr.png",
    },
    {
      id: 6,
      category: "Multispecialty",
      name: "Hope International College & Hospital Pvt. Ltd.",
      location: "Kathmandu, Nepal",
      logoUrl: "https://danphehealth.com/storage/uploads/fUyQ04tj66mbgHu2q9oWf7BX8O7CXvP1keYHTx6r.png",
    },
    {
      id: 7,
      category: "Multispecialty",
      name: "Center for American Medical Specialists (CAMS)",
      location: "Kathmandu, Nepal",
      logoUrl: "https://danphehealth.com/storage/uploads/RqdskDldRTpgBYg5sUUu0OkcmNuBw9QwFK6KKG7e.png",
    },
    {
      id: 8,
      category: "Health Center",
      name: "Anamiwa Health & Wellness Pvt. Ltd.",
      location: "Kathmandu, Nepal",
      logoUrl: "https://danphehealth.com/storage/uploads/zNwWDfrw7lORANZr3TVsvRIl4TNt9okcwnV0VyJd.png",
    },

    {
        id: 9,
        category: "Dental",
        name: "We care Health Center Pvt. Ltd.",
        location: "Kathmandu, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/mrp9fZCqpE7RB9QtJPcaqCtF9D7xPuwW1PdAEYem.png",
      },
      {
        id: 10,
        category: "Health Center",
        name: "Buddhanilkantha Healthcare Pvt. Ltd.",
        location: "Kathmandu, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/WJhqEGEa3RoG8kMO0vitnHKhk5L3LDixj72dxwfm.png",
      },
      {
        id: 11,
        category: "Telehealth Center",
        name: "DanpheCare Pvt. Ltd.",
        location: "Kathmandu, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/iT0rlozWMUr6cep6wMmTncN7B6RUaU6YzntOUzC7.png",
      },
      {
        id: 12,
        category: "Clinic",
        name: "J & J Hospital)",
        location: "Kathmandu, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/NGs58eWiZYX8ugT3PgCYYSvIXGWDR0WuhaeYCdql.png",
      },
      {
        id: 13,
        category: "Diagnostic Center",
        name: "Path Minds Pvt. Ltd.",
        location: "Kathmandu, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/FKitStuvautdQFj0B3RhWI38ThpL4wmjDnE5oQTk.png",
      },
      {
        id: 14,
        category: "Multispecialty",
        name: "Siddhartha Nagar City Hospital Pvt.Ltd.",
        location: "Bhairahawa , Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/dpOuibvB4foJdzuMpROb1Xaduko2KPZ8h5sof1Nz.png",
      },
      {
        id: 15,
        category: "Multispecialty",
        name: "United Hospital Pvt. Ltd.",
        location: "Kapilvastu, Lumbini, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/UY5Nl1ge0eh2V1131Jui5X3yM7p1bcMr1bL8rxh8.png",
      },
      {
        id: 16,
        category: "Multispecialty",
        name: "Charak Hospital Pvt. Ltd.",
        location: "Pokhara, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/s6mv48ri5hDrXDxgzU3E1lIW8qRj9TUrV69b5hQc.jpg",
      },

      {
        id: 17,
        category: "Diagnostic Center",
        name: "Fishtail Hospital Pvt. Ltd.",
        location: "Pokhara, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/rqjKdONW5AKP4sX49m4IIgKAx8zo4I6qm9pHLIdw.png",
      },
      {
        id: 18,
        category: "Multispecialty",
        name: "Deep Hospital & Research Center Pvt. Ltd.",
        location: "Pokhara, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/OA9rPCg0FZwvocMANFPF6jxtkfV7p96pcqF9uYLC.png",
      },
      {
        id: 3,
        category: "Multispecialty",
        name: "Manakamana Hospital Pvt. Ltd.",
        location: "Chitwan, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/DvtgZd0LZopNWutTMb8AYZ7AnQRKHH4ROmN7zCIw.png",
      },
      {
        id: 4,
        category: "Cancer",
        name: "Koshish Cancer Center Pvt. Ltd.",
        location: "Chitwan, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/v5teZ8vGZPGbCUfW3CyPboA3KubVCxTB4MMGvZwz.png",
      },
      {
        id: 5,
        category: "Multispecialty",
        name: "National City Hospital Pvt. Ltd.",
        location: "Chitwan, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/pVMHNZWLFq5EboV3KDxOvCy3Jc1OOCyzgzK3wymT.png",
      },
      {
        id: 6,
        category: "Health Center",
        name: "Raskot Community Hospital",
        location: "Raskot, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/wkvGiKMRmKZuurCYojaRSxCNgdVNPdmOgNkozdd4.png",
      },
      {
        id: 7,
        category: "Multispecialty",
        name: "Bhaktapur International Hospital Pvt.Ltd.",
        location: "Bhaktapur, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/0KpqOj03cknUQiWhyeZOa0jErgLQ61JCsZbDJcf9.png",
      },
      {
        id: 8,
        category: "Clinic",
        name: "Clinic One",
        location: "Bhaktapur, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/eebbEaCnl7GTMz8YRKnKEsvsJGsc4ESdwjPE9VHJ.png",
      },

      {
        id: 1,
        category: "Psychiatry",
        name: "Rhythm Neuropsychiatry Hospital & Research Center Pvt. Ltd.",
        location: "Lalitpur, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/SZupqKkjaGVQo1NLkelyyTd0xgTOxUhKwRat7ywH.png",
      },
      {
        id: 2,
        category: "Multispecialty",
        name: "Maya Metro Hospital pvt. Ltd.",
        location: "Dhangadhi, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/WQEEaXp58AGxNO61rv0xqypPC4KpMhnvpJb2Q01c.png",
      },
      {
        id: 3,
        category: "Pharmacy",
        name: "Radiant Skin Care Pvt. Ltd.",
        location: "Kathmandu, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/ZR2mTmfJgOa5LJXdD1vzZwLNAdBLTrXcoxFy9vhR.png",
      },
      {
        id: 4,
        category: "Multispecialty",
        name: "Dr. Iwamura Hospital",
        location: "Bhaktapur, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/QFwfQF3ZSFGSHxSSF36iBrtcPm1OdnfTewk5Y8NT.png",
      },
      {
        id: 5,
        category: "Specialit Clinic",
        name: "Dr. Priyanka's Clinic",
        location: "Jhapa, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/o3zUZhYzlBjeZCp6rawUgzK57VlbcmxsN6RDF6CS.png",
      },
      {
        id: 6,
        category: "Multispecialty",
        name: "Tillottama Hospital",
        location: "Butwal, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/7REbmptl4aMXkuXVR6CxyjZ4KRKEnZlc729o9onT.png",
      },
      {
        id: 7,
        category: "Multispecialty",
        name: "Butwal Hospital",
        location: "Butwal, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/d3y7B8WFHIbIRlX9s1ca7tcT00oKzqWled7PGcpP.png",
      },
      {
        id: 8,
        category: "Multispecialty",
        name: "Times Care Hospital",
        location: "Dhadhing, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/VZsHzWyXuplNTpoC7dCtxGYSwL0qrbHcZMF8Ze3X.png",
      },

      {
        id: 1,
        category: "Multispecialty",
        name: "Neuro Cardio Hospital",
        location: "Biratnagar, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/PSjGCpwlgqK620FI8qTz4h6vkUvexhNIq0iQUvEz.png",
      },
      {
        id: 2,
        category: "Multispecialty",
        name: "Manmohan Hospital",
        location: "Chandragiri-1, Dahachowk, Kathmandu",
        logoUrl: "https://danphehealth.com/storage/uploads/IHeII9hv0UFpBpwTLouWfOOnGMWDtNaFIbmnQZg1.jpg",
      },
      {
        id: 3,
        category: "Telemedicine Services",
        name: "Ministry of Social Development and Health, Gandaki Province",
        location: "Pokhara, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/cBh4OJ8k33SJFGxJW6OHVMoJXI12tG5yYCkkNBOI.png",
      },
      {
        id: 4,
        category: "Tertiary (Provincial)",
        name: "Lumbini Provincial Hospital",
        location: "Butwal, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/XwKrcFgg8NzD5hs58C8dz91oiCFZ0MnLJNKoqdaQ.png",
      },
      {
        id: 5,
        category: "Multispeciality",
        name: "SGM Hospital Pvt. Ltd",
        location: "Maharastra, India",
        logoUrl: "https://danphehealth.com/storage/uploads/roKTGWaMI1ZvCpKyogTJV22ri3QYifaTXylgCdcC.png",
      },
      {
        id: 6,
        category: "Multispecialty",
        name: "Annapurna Neuro Hospital",
        location: "Kathmandu, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/yonu304X3W9jOBfnsTltJBEBT3DGlSaGkhiFYtAW.png",
      },
      {
        id: 7,
        category: "PHC",
        name: "Bhagiratha Buddhashanti Hospital",
        location: "Jhapa, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/wP6nVDTfZVrlsNzgBH5acvprzNe2j82U9gDb8JwW.png",
      },
      {
        id: 8,
        category: "Community",
        name: "Gorkha Kalika Hospital Pvt.Ltd.",
        location: "Gorkha, Nepal",
        logoUrl: "https://danphehealth.com/storage/uploads/L82LvkPahIamKGECtGEzDgq4A9BvlCmao21y3T6r.png",
      },
  ];
  
function page() {
  return (
    <>
 <section className="md:p-12 p-6 pt-[175px] md:pt-[150px]">
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-1">
    {hospitals.map((hospital) => (
      <a href="" key={hospital.id}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:h-[250px] h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-white bg-customPrimary px-2 py-1 rounded">
              {hospital.category}
            </span>
          </div>
          <Image
            src={hospital.logoUrl}
            alt={`${hospital.name} logo`}
            className="mx-auto"
            width={100}
            objectFit="cover"
            height={100}
          />
          <h3 className="text-base font-semibold text-center">{hospital.name}</h3>
          <p className="text-gray-500 text-center mt-2">{hospital.location}</p>
        </div>
      </a>
    ))}
  </div>
</section>


    </>
  )
}

export default page