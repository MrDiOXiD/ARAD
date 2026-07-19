"use client";

import { useState } from "react";

export default function ProductExtraAttributes() {
  // State to manage dynamic key-value rows
  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);

  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, field, val) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = val;
    setAttributes(newAttributes);
  };

  // Convert the array of inputs [{key: "color", value: "red"}] 
  // into a clean object {"color": "red"} for the backend
  const cleanAttributesObject = attributes.reduce((acc, curr) => {
    if (curr.key.trim() !== "" && curr.value.trim() !== "") {
      acc[curr.key.trim()] = curr.value.trim();
    }
    return acc;
  }, {});

  return (
    <>
      {/* --- Brand & Badge Section --- */}
      <div className="col-md-3">
        <label className="form-label">برند (Brand)</label>
        <input name="brand" type="text" className="form-control" placeholder="مثال: پارس شهاب" />
      </div>

      <div className="col-md-3">
        <label className="form-label">نشان ویژه (Badge)</label>
        <select name="badge" defaultValue="" className="form-select">
          <option value="">بدون نشان</option>
          <option value="new">جدید (New)</option>
          <option value="sale">حراج (Sale)</option>
          <option value="hot">پرفروش (Hot)</option>
        </select>
      </div>

      {/* --- Dynamic Attributes Builder Section --- */}
      <div className="col-md-12 mt-4">
        <div className="card shadow-sm border-0 bg-light">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title mb-0">ویژگی‌های پویا (Technical Attributes)</h6>
              <button
                type="button"
                onClick={addAttribute}
                className="btn btn-sm btn-dark"
              >
                <i className="bi bi-plus"></i> افزودن ویژگی
              </button>
            </div>

            {attributes.map((attr, index) => (
              <div key={index} className="row gy-2 mb-2 align-items-center">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="عنوان (مثال: رنگ، وزن، توان)"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="مقدار (مثال: سفید، ۱ کیلوگرم، ۹ وات)"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                  />
                </div>
                <div className="col-md-1 text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger border-0"
                    onClick={() => removeAttribute(index)}
                    title="حذف"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            {/* 🌟 The Hidden Input that bridges React State with your FormData */}
            <input
              type="hidden"
              name="attributes"
              value={JSON.stringify(cleanAttributesObject)}
            />
          </div>
        </div>
      </div>
    </>
  );
}