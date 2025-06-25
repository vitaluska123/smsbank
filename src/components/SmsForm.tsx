import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Platform, Linking } from 'react-native';

// Форма для ввода номера и суммы, с отправкой SMS
const SmsForm = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  // Формируем текст SMS для Сбербанка
  const getSmsText = () => `Перевод ${phone} ${amount}`;

  // Обработчик отправки
  const handleSend = () => {
    if (!/^9\d{9}$/.test(phone)) {
      Alert.alert('Ошибка', 'Введите корректный номер (10 цифр, начиная с 9)');
      return;
    }
    if (!/^[1-9]\d*$/.test(amount)) {
      Alert.alert('Ошибка', 'Введите корректную сумму');
      return;
    }
    const smsText = getSmsText();
    const smsNumber = '900';
    let url = '';
    if (Platform.OS === 'android') {
      url = `sms:${smsNumber}?body=${encodeURIComponent(smsText)}`;
    } else {
      url = `sms:${smsNumber}&body=${encodeURIComponent(smsText)}`;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть приложение для SMS');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Номер получателя (9ХХ...):</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
        placeholder="9ХХ1234567"
      />
      <Text style={styles.label}>Сумма перевода:</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={amount}
        onChangeText={setAmount}
        placeholder="1000"
      />
      <Button title="Отправить" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    margin: 20,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});

export default SmsForm;
