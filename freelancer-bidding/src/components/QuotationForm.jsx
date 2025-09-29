import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";

const QuotationForm = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    bidAmount: "",
    completionTime: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  const validateForm = () => {
    const errors = {};
    const { bidAmount, completionTime, message } = formData;

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      errors.bidAmount = "Please enter a valid bid amount.";
    }

    if (
      !completionTime ||
      isNaN(completionTime) ||
      Number(completionTime) <= 0
    ) {
      errors.completionTime = "Please enter a valid completion time.";
    }

    if (!message.trim() || message.length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      ...formData,
      jobId: job._id || job.id,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-blue-200"
    >
      <h3 className="text-2xl font-semibold text-blue-800 mb-4">
        Apply for: {job.title}
      </h3>

      <div>
        <InputField
          label="💰 Bid Amount"
          name="bidAmount"
          value={formData.bidAmount}
          onChange={handleChange}
          type="number"
          required
        />
        {formErrors.bidAmount && (
          <p className="text-red-600 text-sm mt-1">{formErrors.bidAmount}</p>
        )}
      </div>

      <div>
        <InputField
          label="⏱ Estimated Completion Time (days)"
          name="completionTime"
          value={formData.completionTime}
          onChange={handleChange}
          type="number"
          required
        />
        {formErrors.completionTime && (
          <p className="text-red-600 text-sm mt-1">
            {formErrors.completionTime}
          </p>
        )}
      </div>

      <div>
        <InputField
          label="📝 Message to Employer"
          name="message"
          value={formData.message}
          onChange={handleChange}
          type="textarea"
          required
        />
        {formErrors.message && (
          <p className="text-red-600 text-sm mt-1">{formErrors.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit Quotation
        </Button>
      </div>
    </form>
  );
};

export { QuotationForm };
