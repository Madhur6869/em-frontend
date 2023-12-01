import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const venues = ({ venue_uid }) => {
  const axiosAuth = useAxiosAuth();

  const [venuesList, setVenuesList] = useState([]);

  const { status, data: session } = useSession();
  const [uid, setUID] = useState();

  const [venueDetails, setVenueDetails] = useState(null);

  const [selectedTimings, setSelectedTimings] = useState([]);
  const [isButtonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  const fetchVenueDetails = async () => {
    try {
      // Replace with your API endpoint
      const response = await axiosAuth.get(
        `/host/venue-details?uid=${venue_uid}&host_id=${uid}`
      );
      console.log(response.data);
      setVenueDetails(response?.data?.venues);

      // Initialize selectedTimings based on the fetched data
      // const timingsArray = response.data.timings || [];
      // setSelectedTimings(timingsArray.map((timing, index) => ({ ...timing, checked: false })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchVenueDetails();
    }
  }, [uid]);

  useEffect(() => {
    // Check if at least one timing is selected
    const atLeastOneChecked = selectedTimings.some((timing) => timing.checked);
    setButtonEnabled(atLeastOneChecked);
  }, [selectedTimings]);

  const handleTimingCheckboxChange = (index) => {
    if (selectedTimings.includes(index)) {
      setSelectedTimings(selectedTimings.filter((i) => i !== index));
    } else {
      setSelectedTimings([...selectedTimings, index]);
    }
  };

  return (
    // <div>
    //   <h1>Venue Details</h1>
    //   <p>Venue ID: {venue_uid}</p>

    //   {venueDetails && (
    //     <div>
    //       <h2>Venue Name: {venueDetails.name}</h2>
    //       <p>Location: {venueDetails.location}</p>
    //       <p>Description: {venueDetails.description}</p>
    //       <p>Host Name: {venueDetails.host_name}</p>
    //       <p>Sport: {venueDetails.sport}</p>
    //       <p>Availability: {venueDetails.availability?"Open":"Closed"}</p>

    //       <h2>Timings</h2>
    //       <ul>
    //         {venueDetails.timings.map((timing, index) => (
    //           <li key={index}>
    //             <input
    //               type="checkbox"
    //               checked={selectedTimings.includes(index)}
    //               disabled ={!venueDetails.availability}
    //               onChange={() => handleTimingCheckboxChange(index)}
    //             />
    //             {timing.timing}
    //           </li>
    //         ))}
    //       </ul>
    //       <button disabled={!isButtonEnabled}>Book Now</button>
    //     </div>
    //   )}
    // </div>
    <div class="p-16 flex">
      <div class="w-1/2 pr-4">
        <img
          src="/images/landing.jpg"
          alt="Venue Image"
          class="w-full h-auto rounded-lg"
        />
      </div>
      <div class="w-1/2 pl-4">
        <h1 class="text-3xl font-bold">Venue Details</h1>
        <p class="mt-2">Venue ID: {venue_uid}</p>

        {venueDetails && (
          <div class="mt-4">
            <h2 class="text-xl font-semibold">
              Venue Name: {venueDetails.name}
            </h2>
            <p class="mt-2">Location: {venueDetails.location}</p>
            <p class="mt-2">Description: {venueDetails.description}</p>
            <p class="mt-2">Host Name: {venueDetails.host_name}</p>
            <p class="mt-2">Sport: {venueDetails.sport}</p>
            <p class="mt-2">Price: {venueDetails.price}</p>
            <p class="mt-2">
              Availability: {venueDetails.availability ? "Open" : "Closed"}
            </p>

            <h2 class="mt-4 text-xl font-semibold">Timings</h2>
            <ul class="mt-2">
              {venueDetails.timings.map((timing, index) => (
                <li key={index} class="flex items-center">
                  {/* <input
                    type="checkbox"
                    checked={selectedTimings.includes(index)}
                    disabled={!venueDetails.availability}
                    onChange={() => handleTimingCheckboxChange(index)}
                    class="mr-2"
                  /> */}
                  {timing.timing}
                </li>
              ))}
            </ul>
            <button
              disabled={!isButtonEnabled}
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps({ res, params: { uid } }) {
  return {
    props: {
      venue_uid: uid,
    },
  };
}

export default venues;
venues.auth = true;