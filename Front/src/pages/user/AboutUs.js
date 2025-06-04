import React from "react";
import Team from "../../assets/images/team.jpg";
import LandmarkImage from "../../assets/images/landmarkImage.jpg";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

export const AboutUs = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${LandmarkImage})`,
        backgroundSize: "cover",
        color: "#333",
        backgroundPosition: "center",
        minHeight: "100vh", // Ensure the container takes up the full viewport height
      }}
    >
      <NavBar />
      <div
        className="container mx-auto mt-32 mb-24"
        style={{
          maxWidth: "1200px",
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent background
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          flexGrow: 1, // Allow this section to grow and push footer down if necessary
        }}
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            style={{
              color: "#115d5a", // Updated to dark teal
              fontSize: "40px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            About Us
          </h1>
          <p style={{ fontSize: "18px", color: "#6b7280", lineHeight: "1.6" }}>
            Discover the beauty, history, and culture of Syria. A land of rich traditions and breathtaking landscapes.
          </p>
        </div>

        {/* Main Sections */}
        <div
          className="flex flex-wrap gap-6 mb-12"
          style={{
            justifyContent: "space-between",
          }}
        >
          {/* Our Story */}
          <div
            className="flex-1 bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 style={{ color: "#115d5a", fontSize: "24px", marginBottom: "15px" }}>
              Our Story
            </h2>
            <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.8" }}>
              Explore Syria's timeless history and culture. From ancient ruins to bustling souks, our mission is to bring the beauty of Syria to travelers around the world.
            </p>
          </div>

          {/* Vision and Mission */}
          <div
            className="flex-1 bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 style={{ color: "#E7C873", fontSize: "24px", marginBottom: "15px" }}>
              Our Vision & Mission
            </h2>
            <ul style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.8" }}>
              <li>
                <strong>Vision:</strong> To celebrate and preserve Syria's cultural and natural heritage.
              </li>
              <li>
                <strong>Mission:</strong> Inspiring global travelers to experience Syria's rich history and vibrant traditions.
              </li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 style={{ color: "#115d5a", fontSize: "28px", marginBottom: "30px" }}>
            Meet the Team
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <TeamMember name="Jane Doe" role="CEO" imgUrl={Team} />
            <TeamMember name="John Smith" role="CTO" imgUrl={Team} />
            <TeamMember name="Alice Johnson" role="Designer" imgUrl={Team} />
          </div>
        </div>

        {/* Core Values */}
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ color: "#E7C873", textAlign: "center", fontSize: "28px", marginBottom: "30px" }}>
            Our Values
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <ValueCard
              title="Heritage"
              description="Preserving and showcasing Syria's timeless culture."
              bgColor="#115d5a" // Updated to dark teal
            />
            <ValueCard
              title="Hospitality"
              description="Sharing the warmth and generosity of Syrian people."
              bgColor="#E7C873" // Updated to gold
            />
            <ValueCard
              title="Sustainability"
              description="Promoting sustainable tourism to protect Syria's treasures."
              bgColor="#6b7280"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const TeamMember = ({ name, role, imgUrl }) => (
  <div
    style={{
      textAlign: "center",
      padding: "20px",
      borderRadius: "15px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      maxWidth: "200px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    }}
  >
    <img
      src={imgUrl}
      alt={`${name}'s photo`}
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        marginBottom: "10px",
        border: "4px solid #fff",
      }}
    />
    <h3 style={{ margin: "0", fontSize: "18px", color: "#115d5a" }}>{name}</h3>
    <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>{role}</p>
  </div>
);

const ValueCard = ({ title, description, bgColor }) => (
  <div
    style={{
      flex: 1,
      minWidth: "220px",
      padding: "25px",
      borderRadius: "15px",
      backgroundColor: bgColor,
      color: "white",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    }}
  >
    <h3 style={{ margin: "0", fontSize: "20px" }}>{title}</h3>
    <p style={{ margin: "10px 0 0", fontSize: "16px" }}>{description}</p>
  </div>
);

export default AboutUs;