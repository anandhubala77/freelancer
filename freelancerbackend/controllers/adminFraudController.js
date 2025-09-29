const Project = require("../models/projectSchema");
const User = require("../models/userSchema");
const Notification = require("../models/notificationSchema");

const getAllFraudReports = async (req, res) => {
  try {
    const projectReports = await Project.find({ "reports.0": { $exists: true } })
      .populate("userId", "name email")
      .populate("reports.reportedBy", "name email");

    const userReports = await User.find({ "reportedBy.0": { $exists: true } })
      .populate("reportedBy.reporterId", "name email");

    const formattedProjectReports = projectReports.flatMap((project) =>
      project.reports.map((report) => ({
        // IDs for Admin UI and actions
        reportId: report._id,
        fraudProjectId: project._id,
        reportedByUserId: report.reportedBy?._id,
        type: "project",
        // Metadata
        projectTitle: project.title,
        projectOwnerName: project.userId?.name,
        projectOwnerEmail: project.userId?.email,
        reportedByName: report.reportedBy?.name,
        reportedByEmail: report.reportedBy?.email,
        reason: report.reason,
        createdAt: report.createdAt,
        responseMessage: report.responseMessage || null,
        responseAt: report.responseAt || null,
      }))
    );

    const formattedUserReports = userReports.flatMap((user) =>
      user.reportedBy.map((report) => ({
        // IDs for Admin UI and actions
        reportId: report._id,
        reportedUserId: user._id,
        reportedByUserId: report.reporterId?._id,
        type: "user",
        // Metadata
        reportedUserName: user.name,
        reportedUserEmail: user.email,
        reportedByName: report.reporterId?.name,
        reportedByEmail: report.reporterId?.email,
        reason: report.reason,
        createdAt: report.reportedAt,
        responseMessage: report.responseMessage || null,
        responseAt: report.responseAt || null,
      }))
    );

    res.status(200).json({
      projectReports: formattedProjectReports,
      userReports: formattedUserReports,
    });
  } catch (error) {
    console.error("Error fetching fraud reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllFraudReports,
};

