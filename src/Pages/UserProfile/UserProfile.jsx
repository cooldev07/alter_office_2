function UserProfile({ user }) {
    return (
        <div className="flex items-center gap-3">
            <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
            <span className="font-medium">{user.displayName}</span>
        </div>
    );
}

export default UserProfile;
