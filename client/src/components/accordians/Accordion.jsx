import React from 'react';
import './accordian.scss';
import { useInView } from 'react-intersection-observer';

const Accordion = () => {
  const data = [
    {
      q: "What type of courses are available on your website?",
      ans: "The Capital Academy offers a wide range of McQ banks customized for various entry test preparation including MdCAT, NUMS, ECAT & others (till now)."
    },
    {
      q: " How do I enroll in a course?",
      ans: `
      Enrolling in a course on our website is easy! Simply browse our selection of McQ banks for entry tests, choose the course that suits your needs, and follow the prompts to complete the enrollment process. Moreover, uploading proof of payment is necessary for gaining access to our McQ banks.
      (Note:
       If you feel difficulty in registering process, you can contact on our given WhatsApp number for help)
      `
    },
    {
      q: "Can I access course material on my mobile device?",
      ans: "Absolutely! Our McQ banks are optimized for mobile access, allowing you to study anytime, anywhere, directly from your smartphone or tablet. Simply log in to our website through your mobile browser for access to all course materials on the go."
    },
    {
      q: "How long do I have access to the course material after enrollment?",
      ans: "Upon enrollment, you'll have access to the McQ bank till your test date."
    },
    {
      q: " How do I communicate with the instructors or ask questions during the course?",
      ans: `
      To communicate with inspectors or ask questions related to the entry test, we're having our WhatsApp groups. You'll be added in the group soon after your enrollment. After joining the group:
      1) Check Group Guidelines: Before posting your questions, review the group guidelines to understand the best practices for communication and ensure your queries are appropriate for the group.
      2) Post Your Questions: Clearly post your questions in the WhatsApp group. Include specific details about your query to help inspectors and other members provide accurate answers.
      3) Tag Our Instructions: Tag our subject specific instructors in your message to ensure they see your question promptly.
      4) Search Previous Discussions: Use the search function within the WhatsApp group to see if your question has already been addressed in previous discussions.
      5) Follow Up: If you do not receive a response within a reasonable time, follow up politely, or consider using alternative communication channels provided by our support team.

      By utilizing the WhatsApp group effectively, you can get timely assistance and support related to your entry test preparations. 
      `
    },
    {
      q: ' Are there any discounts or scholarships available for the courses?',
      ans: `
        Yes, we offer various discounts and scholarships for our McQ banks. We periodically run promotional discounts which can provide significant savings. Additionally, we have a scholarship program for students who demonstrate exceptional academic performance in their FSc exams. Need based scholarships are also available for the deserving candidates.
        (Note: Scholarship only includes fee waivers on our McQ banks)
      `
    },
    {
      q: ' Is there any trial before buying the course?',
      ans: 'Yes, we offer a free trial of our MdCAT McQ bank. This allows you to explore a limited selection of questions and features to help you assess the quality and relevance of our content before making a purchase. Sign up for the free trial on our website to get started and experience the benefits firsthand.'
    },
    {
      q: ' Are there any assessment or full length exam in the course?',
      ans: `Yes, our MdCAT or other entry test McQ bank includes several full-length exams or mock tests designed to simulate the actual entry test experience. These practice exams help you gauge your preparedness, identify areas for improvement, and build confidence under exam conditions. Access to these full-length exams is included with your subscription to the McQ bank.`
    },
    {
      q: `Are the courses self-paced or we've to follow the specific schedule?`,
      ans: `
      Our MdCAT MCQ bank is completely self-paced, allowing you to study at your own convenience and according to your own schedule. There is no fixed timetable, so you can progress through the material at a pace that suits you best. This flexibility is designed to accommodate your individual learning style and other commitments. However, there are flexible schedules available for you to keep up with the pace.
      `
    },
    {
      q: `Are there opportunities for networking with other students or professionals in the field?`,
      ans: `
      Yes, we offer opportunities for networking with other students and professionals in the field. Our platform includes a study group on Facebook where you can connect, share insights, and collaborate with fellow MdCAT aspirants. Additionally, we host periodic webinars and Q&A sessions with medical professionals to provide further guidance and support. This community aspect aims to enhance your learning experience and provide valuable connections in the medical field.
      `
    }
  ];

  // Define animation variants for accordion items
  const accordionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
  };

  // Use useInView to detect when the component is in view
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation once
    threshold: 1 // Trigger animation when component is 50% in view
  });

  return (
    <div className="accordion my-5" ref={ref}>
      <div className="container">
        <h2 className='mt-4 mb-3 board-title after-title fw-bold text-dark fs-2'>Frequently Asked Questions</h2>
        <div className="row">
          <div className="col-12">
            <div className="accordion accordion-flush" id="accordionFlushExample">
              {data.map((e, index) => (
                <div key={index} className="accordion-item mt-2 shadow" style={{ borderRadius: '12px' }} variants={accordionVariants} initial="hidden">
                  <h2 className="accordion-header rounded" id="flush-headingOne">
                    <button className="accordion-button collapsed rounded" style={{ background: '#eddfff91' }} type="button" data-bs-toggle="collapse" data-bs-target={`#id${index}`} aria-expanded="false" aria-controls="{`id${index}`}">
                      {e.q}
                    </button>
                  </h2>
                  <div id={`id${index}`} className="accordion-collapse collapse rounded" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body" style={{whiteSpace:'pre-line'}}>{e.ans}</div>
                  </div>
                </div>
              ))}
              {/* Static Accordion */}
              <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item mt-2 shadow" style={{ borderRadius: '12px' }} variants={accordionVariants} initial="hidden">
                  <h2 className="accordion-header rounded" id="flush-headingLast">
                    <button className="accordion-button collapsed rounded" style={{ background: '#eddfff91' }} type="button" data-bs-toggle="collapse" data-bs-target="#last" aria-expanded="false" aria-controls="last">
                      Why should I choose The Capital Academy?
                    </button>
                  </h2>
                  <div id="last" className="accordion-collapse collapse rounded" aria-labelledby="flush-headingLast" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      <p>(1) User friendly interactive interface</p>
                      <p>(2) Availability of teachers via WhatsApp</p>
                      <p>(3) Past paper questions </p>
                      <p>(4) 50+ Mock Tests</p>
                      <p>(5) Explanation of all the McQs</p>
                      <p>(6) Save McQs to solve later</p>
                      <p>(7) Attempt the wrong McQs again from their separate folder</p>
                      <p>(8) Customized syllabus</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item mt-2 shadow" style={{ borderRadius: '12px' }} variants={accordionVariants} initial="hidden">
                  <h2 className="accordion-header rounded" id="flush-headingLast">
                    <button className="accordion-button collapsed rounded" style={{ background: '#eddfff91' }} type="button" data-bs-toggle="collapse" data-bs-target="#last2" aria-expanded="false" aria-controls="last">
                      How do I communicate with the instructors or ask questions during the course?
                    </button>
                  </h2>
                  <div id="last2" className="accordion-collapse collapse rounded" aria-labelledby="flush-headingLast" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      To communicate with inspectors or ask questions related to the entry test, we're having our WhatsApp groups. You'll be added in the group soon after your enrollment. After joining the group:
                      <p>(1) Check Group Guidelines: Before posting your questions, review the group guidelines to understand the best practices for communication and ensure your queries are appropriate for the group.</p>
                      <p>(2) Post Your Questions: Clearly post your questions in the WhatsApp group. Include specific details about your query to help inspectors and other members provide accurate answers.</p>
                      <p>(3) Tag Our Instructions: Tag our subject specific instructors in your message to ensure they see your question promptly. </p>
                      <p>(4) Search Previous Discussions: Use the search function within the WhatsApp group to see if your question has already been addressed in previous discussions.</p>
                      <p>(5) Follow Up: If you do not receive a response within a reasonable time, follow up politely, or consider using alternative communication channels provided by our support team.</p>
                      By utilizing the WhatsApp group effectively, you can get timely assistance and support related to your entry test preparations.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accordion;
