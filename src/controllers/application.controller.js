import { PersonalParticulars } from "../models/PersonalParticulars.js";

// 1. Submit Application Form (user submits data)
export const submitApplication = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user from authenticated session
    const formData = req.body; // Full form data from the frontend

    // Create a new application record and save to the database
    const newApplication = new PersonalParticulars({
      userId,
      ...formData, // Spread form data into the schema
    });

    await newApplication.save();
    res
      .status(201)
      .json({ message: "Form submitted successfully", data: newApplication });
  } catch (error) {
    next(error);
  }
};

// 2. View Application Form (admin can view form details)
export const viewApplication = async (req, res, next) => {
  try {
    const { userId } = req.params; // Get userId from the URL parameters

    // Fetch the form data from the database using the userId
    const application = await PersonalParticulars.findOne({ userId }).lean();

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ application });
  } catch (error) {
    next(error);
  }
};

// 3. Update Application Form (admin can update missing or incorrect data)
export const updateApplication = async (req, res, next) => {
  try {
    const { userId } = req.params; // Get userId from the URL parameters
    const updatedData = req.body; // Get updated data from the request body

    // Update the existing application form with the new data
    const updatedApplication = await PersonalParticulars.findOneAndUpdate(
      { userId },
      { $set: updatedData }, // Update only the provided fields
      { new: true } // Return the updated document
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res
      .status(200)
      .json({
        message: "Application updated successfully",
        data: updatedApplication,
      });
  } catch (error) {
    next(error);
  }
};

// 4. Get Form Data (for frontend to generate the PDF)
export const getFormData = async (req, res, next) => {
  try {
    const { userId } = req.params; // Get userId from the URL parameters

    // Fetch application data (all form fields) from the database
    const application = await PersonalParticulars.findOne({ userId }).lean();

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Send the entire form data as JSON to the frontend
    res.json({ application });
  } catch (error) {
    next(error);
  }
};
