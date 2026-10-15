import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SearchDogs() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [sort, setSort] = useState('breed:asc'); // Default sort set to alphabetical by breed
  const [dogs, setDogs] = useState([]);
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const [favoriteDogs, setFavoriteDogs] = useState([]);
  const [matchedDog, setMatchedDog] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Page 0 = first 25 results
  const [locationData, setLocationData] = useState(null);
  const [totalResults, setTotalResults] = useState(0);





  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include',
        });
        const data = await res.json();
        setBreeds(data);
      } catch (err) {
        toast.error('Failed to load breeds');
      }
    };
    fetchBreeds();
  }, []);

  const fetchDogs = async (page = 0) => {
    const from = page * 25;
    let url = `https://frontend-take-home-service.fetch.com/dogs/search?size=25&from=${from}`;
    const queryParams = new URLSearchParams();
  
    selectedBreeds.forEach(b => queryParams.append('breeds', b.value));
    if (ageMin !== '') queryParams.append('ageMin', ageMin);
    if (ageMax !== '') queryParams.append('ageMax', ageMax);
    queryParams.append('sort', sort);
  
    url += `&${queryParams.toString()}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
  
        if (data.resultIds.length === 0) {
          toast.info('No dogs found with your criteria.');
        }
  
        setDogs(data.resultIds);
        setTotalResults(data.total);
        setCurrentPage(page);
        return true;
      } else {
        toast.error('Failed to fetch dogs. Please try again.');
        return false;
      }
    } catch (err) {
      toast.error('Network error during dog search.');
      return false;
    }
  };
  
  

  const handleSearch = async (e) => {
    e.preventDefault();
  
    if (selectedBreeds.length === 0) {
      toast.error("Please select at least one breed before searching.");
      return;
    }
  
    const success = await fetchDogs(0); // Start from page 0
    if (!success) {
      console.error("Search failed due to API/network issue.");
    }
  };
  
  

  const breedOptions = breeds.map(breed => ({ label: breed, value: breed }));

  const handleFavoriteChange = (dogId, isChecked) => {
    if (isChecked) {
      setSelectedFavorites(prev => [...prev, dogId]);
    } else {
      setSelectedFavorites(prev => prev.filter(id => id !== dogId));
    }
  };

  const handleSubmitFavorites = async () => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(selectedFavorites), // assumed to be array of dog IDs
      });
  
      if (response.ok) {
        const data = await response.json();
        setFavoriteDogs(data); // Save dog objects to state
        toast.success('Favorites submitted successfully!');
      } else {
        toast.error('Failed to submit favorites');
      }
    } catch (err) {
      toast.error('Error submitting favorites');
    }
  };

  
  const handleMatch = async () => {
    try {
      const ids = favoriteDogs.map((dog) => dog.id); // collect only IDs
  
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(ids),
      });
  
      if (response.ok) {
        const data = await response.json();
        const matchedId = data.match;
  
        // Find the full dog object from favoriteDogs
        const matched = favoriteDogs.find((dog) => dog.id === matchedId);
        setMatchedDog(matched);
  
        toast.success('Match found!');
      } else {
        toast.error('Failed to find a match');
      }
    } catch (err) {
      toast.error('Error finding match');
    }
  };
  
  const handleGetLocation = async () => {
    try {
      const res = await fetch('https://frontend-take-home-service.fetch.com/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify([matchedDog.zip_code]),
      });
  
      if (res.ok) {
        const data = await res.json();
        setLocationData(data[0]); // expecting single location object
        toast.success('Location fetched successfully!');
      } else {
        toast.error('Failed to fetch location');
      }
    } catch (error) {
      toast.error('Error fetching location');
    }
  };
  

  return (
    <div className="container py-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Search Dogs</h2>

      <div className="card shadow-sm p-4 mb-5">
        <form onSubmit={handleSearch}>
          <div className="mb-3">
            <label className="form-label fw-bold">Breed(s)</label>
            <Select
              isMulti
              options={breedOptions}
              value={selectedBreeds}
              onChange={(selected) => setSelectedBreeds(selected || [])}
            />
          </div>

         

          <div className="row mb-3">
            <div className="col">
              <label className="form-label fw-bold">Age Min</label>
              <input
                type="number"
                className="form-control"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
              />
            </div>
            <div className="col">
              <label className="form-label fw-bold">Age Max</label>
              <input
                type="number"
                className="form-control"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Sort By</label>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="age:desc">Age Descending</option>
              <option value="age:asc">Age Ascending</option>
              <option value="breed:asc">Breed Ascending</option>
              <option value="breed:desc">Breed Descending</option>
              <option value="name:asc">Name Ascending</option>
              <option value="name:desc">Name Descending</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      {dogs.length > 0 ? (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Slno</th>
                <th>Dog ID</th>
                <th>Favorite</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map((dogId, index) => (
                <tr key={dogId}>
                  <td>{currentPage * 25 + index + 1}</td>

                  

                  <td>{dogId}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedFavorites.includes(dogId)}
                      onChange={(e) => handleFavoriteChange(dogId, e.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalResults > 0 && (
  <div className="my-4">
    {/* Page and Total Info */}
    <div className="d-flex justify-content-between align-items-center mx-2 px-3">
      <div><strong>Total Dogs Found:</strong> {totalResults}</div>
      <div>Page {currentPage + 1} of {Math.ceil(totalResults / 25)}</div>
    </div>

    {/* Pagination Navigation */}
    <div className="d-flex justify-content-center">
      <nav>
        <ul className="pagination mb-0 flex-wrap">

          {/* Previous */}
          {currentPage > 0 && (
            <li className="page-item">
              <button className="page-link" onClick={() => fetchDogs(currentPage - 1)}>
                Previous
              </button>
            </li>
          )}

          {/* Jump to previous set of 15 */}
          {currentPage >= 15 && (
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => fetchDogs(Math.floor(currentPage / 15) * 15 - 15)}
              >
                &laquo;
              </button>
            </li>
          )}

          {/* Page Numbers */}
          {Array.from({
            length: Math.min(15, Math.ceil(totalResults / 25) - Math.floor(currentPage / 15) * 15),
          }).map((_, idx) => {
            const page = Math.floor(currentPage / 15) * 15 + idx;
            return (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => fetchDogs(page)}>
                  {page + 1}
                </button>
              </li>
            );
          })}

          {/* Jump to next set of 15 */}
          {currentPage < Math.ceil(totalResults / 25) - 15 && (
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => fetchDogs(Math.floor(currentPage / 15) * 15 + 15)}
              >
                &raquo;
              </button>
            </li>
          )}

          {/* Next */}
          {currentPage < Math.ceil(totalResults / 25) - 1 && (
            <li className="page-item">
              <button className="page-link" onClick={() => fetchDogs(currentPage + 1)}>
                Next
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  </div>
)}



{/* 
{totalResults > 0 && (
  <div className="text-right m-3">
    <strong>Total Dogs Found:</strong> {totalResults}
  </div>
)} */}


          {selectedFavorites.length > 0 && (
            <div className="alert alert-info d-flex justify-content-between align-items-center mt-4">
              <div>
                <strong>Selected Favorites:</strong> {selectedFavorites.join(', ')}
              </div>
              <button className="btn btn-success" onClick={handleSubmitFavorites}>
                Submit Favorites
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted">No results yet. Submit a search.</p>
      )}





<div className="dog-cards-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
  {favoriteDogs.map((dog) => (
    <div key={dog.id} className="dog-card" style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      width: '250px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <img
        src={dog.img}
        alt={dog.name}
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <h3>{dog.name}</h3>
      <p>Breed: {dog.breed}</p>
      <p>Age: {dog.age}</p>
      <p><strong>Zip Code:</strong> {dog.zip_code}</p>
     
    </div>
  ))}
</div>



{favoriteDogs.length > 0 && (
  <button
    onClick={handleMatch}
    style={{
      margin: '1rem 0',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }}
  >
    Find Match For Adoption
  </button>
)}



{matchedDog && (
  <div
    style={{
      marginTop: '2rem',
      padding: '2rem',
      border: '2px solid green',
      borderRadius: '12px',
      maxWidth: '1000px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      display: 'flex',
      gap: '2rem',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}
  >
    {/* Left side: Dog details */}
    <div style={{ flex: 1 }}>
      <img
        src={matchedDog.img}
        alt={matchedDog.name}
        style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px' }}
      />
      <h2 style={{ margin: '1rem 0 0.5rem' }}>{matchedDog.name} (🎯 Match!)</h2>
      <p><strong>Breed:</strong> {matchedDog.breed}</p>
      <p><strong>Age:</strong> {matchedDog.age}</p>
     

      
      <button className="btn btn-info mb-2" onClick={handleGetLocation}>
        Get Location
      </button>
    </div>
    <div className="mt-2" style={{ flex: 1 }}>
  {locationData ? (
    <>
      <p><strong>City:</strong> {locationData.city}</p>
      <p><strong>State:</strong> {locationData.state}</p>
      <p><strong>County:</strong> {locationData.county}</p>
      {/* <p><strong>Latitude:</strong> {locationData.latitude}</p>
      <p><strong>Longitude:</strong> {locationData.longitude}</p> */}
      <a
        href={`https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-danger"
      >
        Open in Google Maps
      </a>
    </>
  ) : (
    <div style={{ height: '350px' }}></div> // Placeholder to preserve layout
  )}
</div>

  
  </div>
)}



    </div>
  );
}
