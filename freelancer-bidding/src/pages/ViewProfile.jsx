import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const ViewProfile = () => {
  const { user: profileData } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!profileData) {
    return <p className="text-center py-10">Loading profile...</p>;
  }

  const isJobSeeker = profileData.role === "jobseeker";
  const isHiringPerson = profileData.role === "hiringperson";

  const getProfileImage = () => {
    if (profileData?.profileimg) {
      if (
        profileData.profileimg.startsWith("http") ||
        profileData.profileimg.startsWith("data:image")
      ) {
        return profileData.profileimg;
      } else {
        return `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
        }/${profileData.profileimg}`;
      }
    }
    return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
      {/* 🔙 Back Button */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="text-purple-700 hover:underline text-sm font-medium flex items-center gap-1"
        >
          ← Back
        </button>
      </div>

      {/* Header */}
      <div className="bg-purple-700 text-white p-6 relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold break-words">
            {profileData.name} {profileData.lastName}
          </h1>
          <p className="text-sm mt-1 break-words">{profileData.email}</p>
        </div>
        <Link
          to={
            profileData.role === "hiringperson"
              ? "/user/updateHiringprofile"
              : "/user/profile/edit"
          }
          className="bg-white text-purple-700 px-4 py-2 rounded-full text-sm hover:bg-gray-100 border border-purple-300 flex items-center gap-1 mt-4 sm:mt-0"
        >
          ✏️ Edit Profile
        </Link>
      </div>

      {/* Profile Image */}
      <div className="flex justify-center">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 -mt-14 sm:-mt-16 z-10">
          <img
            src={getProfileImage()}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-md border-4 border-white bg-white mx-auto"
            style={{ objectPosition: "center" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-6 mt-2 sm:mt-0">
        {isJobSeeker && (
          <>
            {/* Skills */}
            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                Skills
              </h2>
              {profileData.skills && profileData.skills.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {profileData.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  No skills added yet. Time to showcase your talents!
                </p>
              )}
            </section>

            {/* Education */}
            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                Education
              </h2>
              {profileData.education && profileData.education.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {profileData.education.map((edu) => (
                    <li key={edu._id}>
                      {edu.degree} at {edu.institution} ({edu.year})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  No education entries yet. Share your academic journey!
                </p>
              )}
            </section>

            {/* Experience */}
            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                Experience
              </h2>
              {profileData.experience && profileData.experience.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {profileData.experience.map((exp) => (
                    <li key={exp._id}>
                      <div className="font-semibold">
                        {exp.title} at {exp.company}
                      </div>
                      <div className="text-sm text-gray-600">
                        {exp.startDate} – {exp.endDate || "Present"}
                      </div>
                      <div className="text-sm">{exp.description}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  No experience added yet. Time to shine!
                </p>
              )}
            </section>
          </>
        )}

        {isHiringPerson && (
          <>
            {/* Company Name */}
            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                Company Name
              </h2>
              <p className="text-gray-700 font-medium">
                {profileData.companyName || "Not provided"}
              </p>
            </section>

            {/* Company Description */}
            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                Company Description
              </h2>
              <p className="text-gray-700 font-medium whitespace-pre-line">
                {profileData.companyDescription || "Not provided"}
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
