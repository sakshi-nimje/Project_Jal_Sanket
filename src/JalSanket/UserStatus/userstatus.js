import supabase from "../supabaseClient.js";

function searchGoogle(latitude, longitude, e) {
    const searchTerm = `${latitude},${longitude}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm)}`;
    window.location.href = googleMapsUrl;
  }
  window.searchGoogle = searchGoogle;

const fetchUserData = async () => {
    try {
        const { data, error } = await supabase
            .from('ActiveComplaintDetails')
            .select('*')
            .eq('userloginId', JSON.parse(localStorage.getItem('user'))['userloginId']);
        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        let serialNumber = 1;

        const complaintContainers = document.getElementsByClassName('complaint-area');

        // Iterate over each complaint area
        Array.from(complaintContainers).forEach(complaintContainer => {
            data.forEach(complaint => {
                const section = document.createElement('section');
                section.className = 'complaint';

                const h2 = document.createElement('h2');
                h2.className = 'complaintNo';
                h2.textContent = 'Complaint No: ' + serialNumber;
                section.appendChild(h2);

                const statusP = document.createElement('p');
                statusP.className = 'statusRepo';
                statusP.innerHTML = 'Status: <span class="status">' + complaint.status + '</span>';
                section.appendChild(statusP);

                const categoryP = document.createElement('p');
                categoryP.className = 'Category';
                categoryP.textContent = 'Category: ' + complaint.category;
                section.appendChild(categoryP);

                const locationP = document.createElement('p');
                locationP.className = 'location';
                locationP.textContent = 'Location: Latitude ' + complaint.latitude + ', Longitude ' + complaint.longitude;
                section.appendChild(locationP);

                const googleMapsLink = document.createElement('a');
                googleMapsLink.href = '#';
                googleMapsLink.textContent = 'Click Here for Location';
                googleMapsLink.onclick = function() {
                    searchGoogle(complaint.latitude, complaint.longitude);
                    return false; 
                };
                section.appendChild(googleMapsLink);

                complaintContainer.appendChild(section);

                serialNumber++;
            });
        });

    } catch (error) {
        console.error('Unexpected error:', error);
    }
};

fetchUserData();