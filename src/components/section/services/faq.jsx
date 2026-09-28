"use client";
import { Button, Input, SelectBox } from "~/components/common/input_box";

export default function ServiceFaqForm({ serviceData = {}, setServiceData }) {
  // Handle FAQ Change by Index
  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFaqs = [...serviceData.faqs];
    updatedFaqs[index][name] = value;
    setServiceData((prev) => ({
      ...prev,
      faqs: updatedFaqs,
    }));
  };

  // Add new FAQ
  const handleAddFaq = () => {
    setServiceData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  // Delete FAQ
  const handleDeleteFaq = (index) => {
    const updatedFaqs = serviceData.faqs.filter((_, i) => i !== index);
    setServiceData((prev) => ({
      ...prev,
      faqs: updatedFaqs,
    }));
  };

  return (
    <section className="w-full p-5 bg-white flex flex-col gap-4 rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl text-black">FAQs</h2>
        <button
          type="button"
          onClick={handleAddFaq}
          className="flex items-center gap-1 text-sm text-blue-600 font-medium"
        >
          + Add FAQ
        </button>
      </div>

      {serviceData.faqs.map((faq, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-lg flex flex-col gap-3 relative"
        >
          {/* Delete Button */}

          <button
            type="button"
            onClick={() => handleDeleteFaq(index)}
            className="w-fit   text-xs p-1.5 rounded-xl bg-black text-white shadow-sm"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z"></path>
            </svg>
          </button>
          {/* Question */}
          <Input
            label={`Question ${index + 1}`}
            name="question"
            value={faq.question}
            onChange={(e) => handleFaqChange(index, e)}
          />

          {/* Answer */}
          <div className="w-full flex flex-col gap-1">
            <label className="first-letter:capitalize text-[12px] font-[600] text-black">
              Answer
            </label>
            <textarea
              name="answer"
              value={faq.answer}
              onChange={(e) => handleFaqChange(index, e)}
              className="text-[13px] disabled:cursor-not-allowed disabled:opacity-80 w-full outline-none border border-gray-200 rounded-[5px] p-[10px] bg-transparent font-medium placeholder:font-normal"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
