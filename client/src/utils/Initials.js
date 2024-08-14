export const getInitials = (fullName) => {
    const nameArray = fullName?.split(' ');
    const initials = nameArray?.map(name => name.charAt(0).toUpperCase()).join('');
    return initials;
};
