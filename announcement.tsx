import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ClassSelector from './ClassSelector';
import { Announcement as AnnouncementType } from '../types';

const Announcement: React.FC = () => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [text, setText] = useState('');
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);

  const handleMakeAnnouncement = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedClass('All Classes');
    setText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClass && text.trim()) {
      const newAnnouncement: AnnouncementType = {
        id: Date.now().toString(),
        className: selectedClass,
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setShowForm(false);
      setSelectedClass('All Classes');
      setText('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-lg font-semibold text-gray-900">{t('announcement')}</h2>
      </div>

      <div className="p-8 sm:p-6">
        {!showForm ? (
          <button
            onClick={handleMakeAnnouncement}
            className="w-full px-6 py-3 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Announcement
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <ClassSelector
                selectedClass={selectedClass}
                onClassChange={setSelectedClass}
              />
            </div>
            <div>
              <label htmlFor="announcementText" className="block text-sm font-medium text-gray-700">
                Text
              </label>
              <textarea
                id="announcementText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="mt-1 block w-full py-3 px-4 sm:py-2 sm:px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base sm:text-sm"
                placeholder="Enter announcement text"
                required
              />
            </div>
            <div className="flex space-x-3 sm:space-x-2">
              <button
                type="submit"
                className="px-6 py-3 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 sm:px-4 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Previous Announcements */}
        {announcements.length > 0 && (
          <div className="mt-8">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Previous Announcements</h3>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-blue-600">{announcement.className}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(announcement.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{announcement.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcement;
