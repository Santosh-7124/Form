import React, { useState, useRef } from "react";
import FormResponse from "./FormResponse";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [file, setFile] = useState(null); // Track file for submission
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponseVisible, setIsResponseVisible] = useState(false); // Control visibility of FormResponse
  const [isLoading, setIsLoading] = useState(false); // Loading state to show the loader

  const fileInputRef = useRef(null); // Create ref for file input

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show the loader
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("message", formData.message);
      if (file) {
        formDataToSend.append("file", file);
      }

      const response = await fetch(
        "https://backend-umber-chi.vercel.app/api/server",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();
      setResponseMessage(result.message);
      setIsResponseVisible(true); // Show response after submission

      // Clear form data after successful submission
      setFormData({ name: "", email: "", message: "" });
      setFile(null); // Reset file state
      fileInputRef.current.value = ""; // Reset the file input field
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("Failed to submit the form. Please try again later.");
      setIsResponseVisible(true); // Show response even on error
    } finally {
      // Hide the loader after the submission process is done
      setIsLoading(false);
    }
  };

  const handleOkClick = () => {
    setIsResponseVisible(false); // Hide response after "Ok" is clicked
  };

  return (
    <div>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button type="submit">Submit</button>
      </form>

      {/* Loader shown when isLoading is true */}
      {isLoading && <div className="loader"></div>}

      {isResponseVisible && (
        <FormResponse message={responseMessage} onOkClick={handleOkClick} />
      )}
    </div>
  );
};

export default ContactForm;
