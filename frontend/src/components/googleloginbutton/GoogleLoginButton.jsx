const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <button onClick={handleGoogleLogin} style={{
      backgroundColor: '#4285F4',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      marginTop: '10px',
      cursor: 'pointer'
    }}>
      Google ilə daxil ol
    </button>
  );
};

export default GoogleLoginButton;
