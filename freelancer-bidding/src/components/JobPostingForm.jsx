import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { createProject } from '../store/slices/projectSlice';

const JobPostingForm = ({ onSubmit, job }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    skillsRequired: '',
    timeline: '',
    location: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        category: job.category || '',
        description: job.description || '',
        budget: job.budget !== undefined && job.budget !== null ? String(job.budget) : '',
        skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired.join(', ') : '',
        timeline: job.timeline || '',
        location: job.location || '',
      });

      if (job.image) {
        setImagePreview(job.image);
      }
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';

    if (!formData.budget.trim()) {
      errors.budget = 'Budget is required';
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      errors.budget = 'Enter a valid number greater than 0';
    }

    if (formData.timeline && formData.timeline.length > 100) {
      errors.timeline = 'Timeline is too long (max 100 characters)';
    }

    const skills = formData.skillsRequired
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (skills.length === 0) {
      errors.skillsRequired = 'Enter at least one skill';
    }

    if (imageFile) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(imageFile.type)) {
        errors.image = 'Only JPG, JPEG, PNG or WEBP files are allowed';
      }
      const maxSizeMB = 2;
      if (imageFile.size > maxSizeMB * 1024 * 1024) {
        errors.image = 'Image must be less than 2MB';
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const form = new FormData();
    form.append('title', formData.title);
    form.append('category', formData.category);
    form.append('description', formData.description);
    form.append('budget', formData.budget);
    form.append('timeline', formData.timeline);
    form.append('location', formData.location);
    form.append('skillsRequired', skills.join(','));

    if (imageFile && imageFile instanceof File) {
      form.append('image', imageFile);
    }

    onSubmit(job && job._id 
      ? { projectId: job._id, updatedData: form } // for edit
      : form 
    );
    
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 md:p-6 rounded-xl shadow-xl border border-gray-200 max-w-2xl mx-auto w-full overflow-y-auto"
      style={{ maxHeight: '80vh' }}
      autoComplete="off"
    >
      <h2 className="text-xl md:text-2xl font-bold text-blue-800 text-center mb-4">
        {job ? 'Edit Project Details' : 'Post a New Project'}
      </h2>

      <div className="space-y-3">
        <div>
          <InputField
            label="Project Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Build a React Native Mobile App"
            required
          />
          {formErrors.title && <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>}
        </div>

        <div>
          <InputField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Web Development, Mobile, Design"
            required
          />
          {formErrors.category && <p className="text-red-600 text-sm mt-1">{formErrors.category}</p>}
        </div>

        <div>
          <InputField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="textarea"
            rows={3}
            placeholder="Provide a detailed description of your project."
            required
          />
          {formErrors.description && <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <InputField
              label="Budget (USD)"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="e.g., 5000"
              required
            />
            {formErrors.budget && <p className="text-red-600 text-sm mt-1">{formErrors.budget}</p>}
          </div>

          <div>
            <InputField
              label="Timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="e.g., 2-4 weeks, Flexible"
            />
            {formErrors.timeline && <p className="text-red-600 text-sm mt-1">{formErrors.timeline}</p>}
          </div>
        </div>

        <div>
          <InputField
            label="Skills Required (comma-separated)"
            name="skillsRequired"
            value={formData.skillsRequired}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB, UI/UX"
          />
          {formErrors.skillsRequired && (
            <p className="text-red-600 text-sm mt-1">{formErrors.skillsRequired}</p>
          )}
        </div>

        <div>
          <InputField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Remote, Kochi"
          />
          {formErrors.location && <p className="text-red-600 text-sm mt-1">{formErrors.location}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Project Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 transition"
          />
          {formErrors.image && <p className="text-red-600 text-sm mt-1">{formErrors.image}</p>}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 rounded-lg max-h-48 object-cover border shadow-md"
            />
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full py-3 text-base mt-6 bg-blue-800 hover:bg-blue-900 text-white rounded-xl transition"
      >
        {job ? 'Update Project' : 'Post Project'}
      </Button>
    </form>
  );
};

export default JobPostingForm;

//3first validat