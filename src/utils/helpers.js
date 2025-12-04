// Format timestamp to readable format
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';

  let date;
  if (timestamp?.toDate) {
    // Firebase Timestamp
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    return '';
  }

  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'Baru saja';
  } else if (minutes < 60) {
    return `${minutes} menit yang lalu`;
  } else if (hours < 24) {
    return `${hours} jam yang lalu`;
  } else if (days === 1) {
    return 'Kemarin';
  } else if (days < 7) {
    return `${days} hari yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

// Format time only (HH:mm)
export const formatTime = (timestamp) => {
  if (!timestamp) return '';

  let date;
  if (timestamp?.toDate) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    return '';
  }

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date with time
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';

  let date;
  if (timestamp?.toDate) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    return '';
  }

  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validate username
export const validateUsername = (username) => {
  if (!username || username.trim().length < 3) {
    return { valid: false, message: 'Username minimal 3 karakter' };
  }
  if (username.length > 20) {
    return { valid: false, message: 'Username maksimal 20 karakter' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username hanya boleh huruf, angka, dan underscore' };
  }
  return { valid: true, message: '' };
};

// Validate password
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password minimal 6 karakter' };
  }
  if (password.length > 50) {
    return { valid: false, message: 'Password maksimal 50 karakter' };
  }
  return { valid: true, message: '' };
};

// Generate avatar color from name
export const getAvatarColor = (name) => {
  if (!name) return '#4A90E2';
  
  const colors = [
    '#4A90E2', '#E74C3C', '#27AE60', '#F39C12', 
    '#9B59B6', '#1ABC9C', '#E67E22', '#3498DB',
    '#2ECC71', '#E84393', '#0984E3', '#6C5CE7'
  ];
  
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
