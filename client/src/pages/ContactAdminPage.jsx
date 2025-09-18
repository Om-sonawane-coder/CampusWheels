import React from 'react';

function ContactAdminPage() {
  return (
    // Main container theme updated
    <div className="bg-[var(--color-background)] min-h-[calc(100vh-160px)] py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          {/* Text colors updated */}
          <h1 className="text-4xl font-bold mb-6 text-center text-[var(--color-secondary)]">Get in Touch</h1>
          <p className="text-lg text-slate-600 mb-8 text-center">
            We're here to help. If you have any questions, feedback, or issues, please don't hesitate to reach out.
          </p>
          
          <div className="space-y-6">
            {/* Email Contact */}
            <div className="flex items-start space-x-4">
              {/* Icon colors updated */}
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-700">Email Us</h3>
                {/* Link color updated */}
                <a href="mailto:admin@campuswheels.com" className="text-[var(--color-primary)] hover:underline">admin@campuswheels.com</a>
              </div>
            </div>

            {/* Phone Contact */}
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-700">Call Us</h3>
                <p className="text-slate-600">+91 12345 67890</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-8 text-center">
            We typically respond within 24-48 business hours.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactAdminPage;