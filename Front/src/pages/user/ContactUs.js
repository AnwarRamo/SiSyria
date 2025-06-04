import React from "react";
import LandmarkImage from "../../assets/images/landmarkImage.jpg";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

export const ContactUs = () => {
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
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <div
        className="container mx-auto mt-32 mb-24"
        style={{
          maxWidth: "1200px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          flexGrow: 1,
        }}
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            style={{
              color: "#115d5a", // Updated to dark teal
              marginBottom: "20px",
              fontSize: "40px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Contact Us
          </h1>
          <p style={{ fontSize: "18px", color: "#555" }}>
            Get in touch with us for inquiries, support, or feedback.
          </p>
        </div>

        {/* Main Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          {/* Contact Info Section */}
          <div
            style={{
              flex: 1,
              minWidth: "300px",
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ color: "#115d5a", marginBottom: "20px" }}> {/* Updated to dark teal */}
              Contact Information
            </h2>
            <ContactItem icon="📞" title="Call Us" detail="+963 987 233 120" />
            <ContactItem icon="📧" title="Email Us" detail="info@syrianlancer.com" />
            <ContactItem icon="📍" title="Visit Us" detail="Syria" />
          </div>

          {/* Form Section */}
          <div
            style={{
              flex: 2,
              minWidth: "300px",
              backgroundColor: "#f8f9fa",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ color: "#115d5a", marginBottom: "20px" }}> {/* Updated to dark teal */}
              Send Us a Message
            </h2>
            <form>
              <InputField label="Full Name" placeholder="Enter your name" />
              <InputField label="Email" placeholder="example@gmail.com" type="email" />
              <InputField label="Phone Number" placeholder="+963" type="tel" />
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Message</label>
                <textarea
                  rows="5"
                  placeholder="Type your message..."
                  style={textareaStyle}
                />
              </div>
              <button
                type="submit"
                style={buttonStyle}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// Contact Item Component
const ContactItem = ({ icon, title, detail }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "15px",
    }}
  >
    <div
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "#E7C873", // Updated to gold
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        color: "white",
      }}
    >
      {icon}
    </div>
    <div>
      <h4 style={{ margin: "0", fontSize: "18px", color: "#115d5a" }}>{title}</h4> {/* Updated to dark teal */}
      <p style={{ margin: "0", color: "#555", fontSize: "16px" }}>{detail}</p>
    </div>
  </div>
);

// Input Field Component
const InputField = ({ label, placeholder, type = "text" }) => (
  <div style={{ marginBottom: "20px" }}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
    />
  </div>
);

// Styles
const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "10px",
  fontSize: "16px",
  color: "#115d5a", // Updated to dark teal
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
  transition: "border-color 0.3s",
};

const textareaStyle = {
  ...inputStyle,
  resize: "none",
};

// Button Style
const buttonStyle = {
  background: "#115d5a", // Updated to dark teal
  color: "white",
  padding: "15px 30px",
  border: "none",
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default ContactUs;