import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Platform, Linking } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import banks from '../templates/banks.json';

// Форма для перевода денег через SMS с выбором банка и метода
const SmsForm = () => {
  // Состояния для DropDownPicker
  const [bankOpen, setBankOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [bankValue, setBankValue] = useState(banks[0].name);
  const [methodValue, setMethodValue] = useState(banks[0].methods[0].name);

  // Состояния для полей
  const [phone, setPhone] = useState('');
  const [card, setCard] = useState('');
  const [amount, setAmount] = useState('');

  // Получаем выбранный банк и метод
  const selectedBank = banks.find(b => b.name === bankValue) || banks[0];
  const selectedMethod = selectedBank.methods.find(m => m.name === methodValue) || selectedBank.methods[0];

  // Обновлять выбранный метод при смене банка
  useEffect(() => {
    setMethodValue(selectedBank.methods[0].name);
  }, [bankValue]);

  // Формируем текст SMS по шаблону
  const getSmsText = () => {
    let text = selectedMethod.value;
    text = text.replace('<number>', phone).replace('<card>', card).replace('<sum>', amount);
    return text;
  };

  // Обработчик отправки
  const handleSend = () => {
    if (selectedMethod.value.includes('<number>')) {
      if (!/^9\d{9}$/.test(phone)) {
        Alert.alert('Ошибка', 'Введите корректный номер (10 цифр, начиная с 9)');
        return;
      }
    }
    if (selectedMethod.value.includes('<card>')) {
      if (!/^\d{16,18}$/.test(card)) {
        Alert.alert('Ошибка', 'Введите корректный номер карты (16-18 цифр)');
        return;
      }
    }
    if (!/^[1-9]\d*$/.test(amount)) {
      Alert.alert('Ошибка', 'Введите корректную сумму');
      return;
    }
    const smsText = getSmsText();
    const smsNumber = selectedBank.banknumber;
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
      <Text style={styles.label}>Банк:</Text>
      <DropDownPicker
        open={bankOpen}
        value={bankValue}
        items={banks.map(b => ({ label: b.name, value: b.name }))}
        setOpen={setBankOpen}
        setValue={setBankValue}
        setItems={() => {}}
        zIndex={3000}
        zIndexInverse={1000}
        style={styles.dropdown}
      />
      <Text style={styles.label}>Способ перевода:</Text>
      <DropDownPicker
        open={methodOpen}
        value={methodValue}
        items={selectedBank.methods.map(m => ({ label: m.name, value: m.name }))}
        setOpen={setMethodOpen}
        setValue={setMethodValue}
        setItems={() => {}}
        zIndex={2000}
        zIndexInverse={2000}
        style={styles.dropdown}
      />
      {selectedMethod.value.includes('<number>') && (
        <>
          <Text style={styles.label}>Номер получателя (9ХХ...):</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            placeholder="9ХХ1234567"
          />
        </>
      )}
      {selectedMethod.value.includes('<card>') && (
        <>
          <Text style={styles.label}>Номер карты:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={18}
            value={card}
            onChangeText={setCard}
            placeholder="1234567812345678"
          />
        </>
      )}
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
  dropdown: {
    marginBottom: 12,
    zIndex: 1000,
  },
});

export default SmsForm;
