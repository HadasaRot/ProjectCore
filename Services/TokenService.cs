using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ProjectCore.Services
{
    public static class TokenService
    {
        private static SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SXkSqsKyNUyvGbnyjyjuykfFHJq8zQzhLW7mPmHbnZZ"));
        private static string issuer = "https://book-demo.com";
        public static SecurityToken GetToken(List<Claim> claims) =>
           new JwtSecurityToken(
               issuer,
               issuer,
               claims,
               expires: DateTime.Now.AddDays(30),
               signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
           );
        public static TokenValidationParameters GetTokenValidationParameters() =>
        new TokenValidationParameters
        {
            ValidIssuer = issuer,
            ValidAudience = issuer,
            IssuerSigningKey = key,
            ClockSkew = TimeSpan.Zero
        };

        public static string WriteToken(SecurityToken token) =>
            new JwtSecurityTokenHandler().WriteToken(token);
        public static string decodedToken(string? token)
        {
            if (token != null)
                token = token.Replace("Bearer ", "");
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            string id = jwtSecurityToken.Claims.First(claim => claim.Type == "UserId").Value;
            return id;
        }
        public static string decodedToken(string? token, string claimType)
        {
              if (token != null)
                token = token.Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            return jsonToken?.Claims.FirstOrDefault(c => c.Type == claimType)?.Value ?? throw new Exception("Claim not found");
        }



    }
}